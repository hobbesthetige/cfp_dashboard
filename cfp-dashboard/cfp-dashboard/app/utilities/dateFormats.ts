import moment from "moment";

export function formatDateInZuluTime(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ") + " Zulu";
}

export function formatTimeInAnnotatedZuluTime(date: Date): string {
  return date.toISOString().slice(11, 16) + " Zulu";
}

export const formatTimestamp = (timestamp: string) => {
  return moment(timestamp).format("YYYY-MM-DDTHH:mm");
};

export const formatTimeInterval = (
  timeInterval: number,
  includeMS = false,
  includeLabels = false,
  excludeZeroValues = false
) => {
  const duration = moment.duration(timeInterval);
  const tolerance = 0.001; // Tolerance for fractional values close to zero

  let hours = Math.floor(duration.asHours());
  let minutes = duration.minutes();
  let seconds = duration.seconds();
  let milliseconds = duration.milliseconds();

  if (excludeZeroValues) {
    if (Math.abs(hours) < tolerance && Math.abs(minutes) < tolerance && Math.abs(seconds) < tolerance) {
      return includeMS ? `0.${milliseconds.toString().padStart(3, '0')}ms` : '0s';
    }

    if (Math.abs(hours) < tolerance && Math.abs(minutes) < tolerance) {
      return includeLabels
        ? `${seconds}s`
        : `${seconds.toString().padStart(2, '0')}`;
    }

    if (Math.abs(hours) < tolerance) {
      return includeLabels
        ? `${minutes}m ${seconds}s`
        : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  let formattedTime = includeLabels
    ? `${hours}h ${minutes}m ${seconds}s`
    : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (includeMS) {
    if (includeLabels) {
      formattedTime += ` ${milliseconds}ms`;
    } else {
      formattedTime += `.${milliseconds.toString().padStart(3, '0')}`;
    }
  }

  return formattedTime;
};




export const formatPingTimeInterval = (timeInterval: number) => {
  const seconds = timeInterval / 1000;
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((timeInterval % 1000));
  const secondsString = seconds >= 1 ? `${remainingSeconds.toString().padStart(2, "0")}s.` : "";
  let formattedTime = `${secondsString}${milliseconds.toString().padStart(2, "0")}ms`;

  return formattedTime;
}