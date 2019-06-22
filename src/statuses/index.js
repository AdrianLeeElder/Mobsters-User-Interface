const Status = Object.freeze({
  IDLE: "idle",
  QUEUED: "queued",
  RUNNING: "running",
  COMPLETE: "complete"
})

function getIcon(status) {
    switch (status) {
        case Status.IDLE:
          return "lightbulb";
        case Status.QUEUED:
          return "paper-plane";
          break;
        case Status.RUNNING:
          return "spinner";
        case Status.COMPLETE:
          return "check-circle";
        default:
          return "";
      }
}

function getToolTip(status) {
    switch (status) {
        case Status.IDLE:
          return "Jobs are idle, none are queued or running. Some could be complete.";
        case Status.QUEUED:
          return "No jobs are running, there are pending jobs in the executor. Idle jobs may still be present.";
        case Status.RUNNING:
          return "There are some running jobs.";
          case Status.COMPLETE:
          return "All jobs have completed.";
      }
}

export {getIcon, getToolTip, Status}