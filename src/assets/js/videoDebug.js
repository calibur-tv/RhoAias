export default class {
  constructor(player) {
    this.player = player;
    this.events = [
      "abort",
      "canplay",
      "canplaythrough",
      "durationchange",
      "emptied",
      "ended",
      "error",
      "interruptbegin",
      "interruptend",
      "loadeddata",
      "loadedmetadata",
      "loadstart",
      "mozaudioavailable",
      "pause",
      "play",
      "playing",
      "progress",
      "ratechange",
      "seeked",
      "seeking",
      "stalled",
      "suspend",
      "timeupdate",
      "volumechange",
      "waiting"
    ];
    this.init();
  }
  init() {
    this.events.forEach(evt => {
      this.player.addEventListener(evt, () => {
        console.log("video lifecycle", evt);
      });
    });
  }
}
