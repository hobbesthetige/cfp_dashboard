import ping from "ping";
import {
  resetData,
  getPingStatusData,
  updatePingStatusData,
} from "../models/pingStatus.mjs";
import { getEquipmentGroupsNamespace } from "../sockets/socketNamespaces.mjs";
import { getEventItemsNamespace } from "../sockets/socketNamespaces.mjs";
import {
  getEquipmentGroups,
  updateEquipmentGroup,
} from "../models/equipment.mjs";
import { getPingStatusNamespace } from "../sockets/socketNamespaces.mjs";

class PingService {
  constructor() {
    this.services = new Map();
    resetData();
  }

  addService(service) {
    this.startPinging(service);
  }

  removeService(serviceId) {
    if (this.services.has(serviceId)) {
      const service = this.services.get(serviceId);
      clearInterval(service.pingIntervalMap);
      this.services.delete(serviceId);
    }
  }

  async startPinging(service) {
    const { serviceId, hostname } = service;
    const {
      initialPingInterval = 1000, // Initial fast ping interval
      targetPingInterval = 5000, // Target slower ping interval
      rollingAverage = 10,
      errorTolerance = 5,
    } = service;
    let currentInterval = initialPingInterval;

    const pingData = {
      ...service,
      pingResults: [],
      responseTimes: [],
      errorCount: 0,
      status: "offline",
      pingIntervalMap: null, // Initialize the interval map
    };

    const pingFunction = async () => {
      try {
        const res = await ping.promise.probe(hostname);
        pingData.pingResults.push(res.alive);
        if (typeof res.time === "number") {
          pingData.responseTimes.push(res.time);
        }

        // Reset error count on successful ping
        pingData.errorCount = 0;

        if (pingData.pingResults.length > rollingAverage) {
          // Keep only the last rollingAverage results
          pingData.pingResults.shift();
        }
        if (pingData.responseTimes.length > rollingAverage) {
          pingData.responseTimes.shift();
        }
        await this.updateStatus(pingData);

        // Adjust ping interval dynamically
        if (
          pingData.pingResults.filter((result) => result).length <
          rollingAverage
        ) {
          currentInterval = initialPingInterval;
        } else {
          currentInterval = targetPingInterval;
        }
        pingData.currentInterval = currentInterval;
        clearInterval(pingData.pingIntervalMap);
        pingData.pingIntervalMap = setInterval(pingFunction, currentInterval);

        this.services.set(serviceId, pingData); // Store the service data
        this.writeService(pingData);
      } catch (error) {
        console.error("Ping failed:", error);

        // Increment error count on failure
        pingData.errorCount += 1;

        // Check if error count exceeds threshold
        if (
          pingData.errorCount >= errorTolerance &&
          pingData.status !== "unreachable"
        ) {
          this.errorServiceStatus(pingData);
          this.services.set(serviceId, pingData); // Store the service data
          this.writeService(pingData);
        }
      }
    };

    pingData.pingIntervalMap = setInterval(pingFunction, currentInterval);
    this.services.set(serviceId, pingData); // Store the service data
    await this.writeService(pingData);
  }

  async writeService(service) {
    const { serviceId } = service;
    const flattenedService = {
      ...service,
      lastUpdated: new Date().toISOString(),
      pingIntervalMap: null, // Remove pingIntervalMap to avoid issues with serialization
    };
    const pingStatus = (await getPingStatusData()) || {};
    pingStatus.services = pingStatus.services || {};
    pingStatus.services[serviceId] = flattenedService;
    await updatePingStatusData(pingStatus);
    getPingStatusNamespace()?.emit("pong", flattenedService);
  }

  async updateStatus(service) {
    const successfulPings = service.pingResults.filter(
      (result) => result
    ).length;
    const failedPings = service.pingResults.filter((result) => !result).length;
    const { rollingAverage = 10, errorTolerance = 5 } = service;
    const oldStatus = service.status;
    if (successfulPings === 0 && failedPings === 0) {
      service.status = "Not Started";
      service.statusColor = "default";
    } else if (successfulPings === rollingAverage) {
      service.status = "Online";
      service.statusColor = "success";
    } else if (failedPings > errorTolerance) {
      service.status = "Degraded";
      service.statusColor = "warning";
    } else if (
      successfulPings > 0 &&
      failedPings < errorTolerance &&
      successfulPings > failedPings
    ) {
      service.status = "Intermittent";
      service.statusColor = "warning";
    } else if (service.pingResults.length > 0) {
      service.status = "Pending";
      service.statusColor = "info";
    } else {
      service.status = "Unreachable";
      service.statusColor = "error";
    }
    if (oldStatus !== service.status) {
      await this.updateEquipmentServiceStatus(service);
    }
    service.averageResponseTime = this.getAverageResponseTime(
      service.responseTimes
    );
  }

  async updateEquipmentServiceStatus(service) {
    console.log("Updating equipment service status:", service);
    const serviceID = service.serviceId;
    let equipmentGroups = await getEquipmentGroups();
    const equipmentGroup = equipmentGroups.find((group) =>
      group.services.some((service) => service.id === serviceID)
    );
    if (equipmentGroup) {
      const serviceIndex = equipmentGroup.services.findIndex(
        (service) => service.id === serviceID
      );
      console.log("Equipment group:", equipmentGroup, serviceIndex);
      if (serviceIndex !== -1) {
        const newHistory = {
          status: equipmentGroup.services[serviceIndex].status,
          notes: equipmentGroup.services[serviceIndex].notes,
          timestamp: equipmentGroup.services[serviceIndex].lastUpdated,
        };
        const oldStatus = equipmentGroup.services[serviceIndex].status;
        const history = [
          newHistory,
          ...equipmentGroup.services[serviceIndex].history,
        ];
        equipmentGroup.services[serviceIndex].status = service.status;
        equipmentGroup.services[serviceIndex].statusColor = service.statusColor;
        equipmentGroup.services[serviceIndex].history = history;
        await updateEquipmentGroup(equipmentGroup.id, equipmentGroup);
        equipmentGroups = await getEquipmentGroups();
        getEquipmentGroupsNamespace()?.emit("equipmentGroups", equipmentGroups);
        const event = {
          id: uuidv4(),
          level: "Alert",
          category: `${equipmentGroup.name} ${service.enclave} ${service.serviceName}`,
          title: `Status updated to **${service.status}**.`,
          message: `Previous status: ${oldStatus}. Updated from continuous polling.`,
          author: "System",
          isUserGenerated: false,
          timestamp: new Date().toISOString(),
        };
        getEventItemsNamespace()?.emit("newEventItem", event);
      }
    }
  }

  errorServiceStatus(service) {
    service.status = "unreachable";
    service.pingResults = [];
    service.responseTimes = [];
    service.averageResponseTime = -1;
  }

  async getStatus(serviceId) {
    const pingStatus = await getPingStatusData();
    return pingStatus.services[serviceId];
  }

  getAverageResponseTime(responseTimes) {
    const totalResponseTime = responseTimes.reduce(
      (acc, time) => acc + time,
      0
    );
    return responseTimes.length ? totalResponseTime / responseTimes.length : 0;
  }
}

export default new PingService();
