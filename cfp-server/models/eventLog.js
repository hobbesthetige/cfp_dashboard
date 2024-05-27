// interface EventLog {
// id: string;
// category: string;
// message: string;
// isUserGenerated: boolean;
// timestamp: string;
// author: string;
// }

let eventLogs = [
  {
    id: "1",
    category: "CFP",
    message: "System started",
    isUserGenerated: false,
    author: "System",
    timestamp: new Date().toISOString(),
  },
];

module.exports = { eventLogs };
