// interface EventLog {
//   category: string;
//   message: string;
//   isUserGenerated: boolean;
//   author: string;
//   timestamp: string;
// }

let eventLogs = [
  {
    category: "CFP",
    message: "System started",
    isUserGenerated: false,
    author: "System",
    timestamp: new Date().toISOString(),
  },
];

module.exports = { eventLogs };
