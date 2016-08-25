export default class Scheduler {
  constructor(opts) {
    this.context = opts.context;
    this.interval = 0.025;
    this.aheadTime = 0.0;
    this.playbackTime = this.currentTime;

    this.timerID = 0;
    this.scheduleID = 0;
    this.schedules = [];
  }

  start(callback, args) {
    const loop = () => {
      const t0 = this.context.currentTime;
      const t1 = t0 + this.aheadTime;

      this.process(t0, t1);
    };

    if (this.timerID === 0) {
      this.timerID = setInterval(loop, this.interval * 1000);

      if (callback) {
        this.insert(this.context.currentTime, callback, args);
        loop();
      }
    } else {
      this.insert(this.context.currentTime, callback, args);
    }

    return this;
  }

  stop(reset) {
    if (this.timerID !== 0) {
      clearInterval(this.timerID);
      this.timerID = 0;
    }

    if (reset) {
      this.schedules.splice(0);
    }

    return this;
  }

  insert(time, callback, args) {
    const id = ++this.scheduleID;
    const event = { id, time, callback, args, };

    if (this.schedules.length === 0 || this.schedules[this.schedules.length - 1].time <= time) {
      this.schedules.push(event);
    } else {
      for (let i = 0, imax = this.schedules.length; i < imax; i++) {
        if (time < this.schedules[i].time) {
          this.schedules.splice(i, 0, event);
          break;
        }
      }
    }

    return id;
  }

  nextTick(time, callback, args) {
    return this.insert(time + this.aheadTime, callback, args);
  }

  remove(scheduleID) {
    if (typeof scheduleID === 'number') {
      for (let i = 0, imax = this.schedules.length; i < imax; i++) {
        if (scheduleID === this.schedules[i].id) {
          this.schedules.splice(i, 1);
          break;
        }
      }
    }

    return scheduleID;
  }

  removeAll() {
    this.schedules.splice(0);
  }

  process(t0, t1) {
    this.playbackTime = t0;

    while (this.schedules.length && this.schedules[0].time < t1) {
      const event = this.schedules.shift();
      const playbackTime = event.time;
      const args = event.args;

      this.playbackTime = playbackTime;

      event.callback({ playbackTime, args, });
    }

    this.playbackTime = t0;
  }
}
