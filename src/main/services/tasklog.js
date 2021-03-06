// import ansiHTML from 'ansi-html';
import iconv from 'iconv-lite';

import config from 'config-main-nowa';

class TaskLog {
  constructor() {
    this.log = {};
  }

  getCmd(cmd) {
    if (!this.log[cmd]) {
      this.log[cmd] = {};
    }
    return this.log[cmd];
  }

  getTask(cmd, projPath) {
    const task = this.getCmd(cmd);

    if (!task[projPath]) {
      task[projPath] = {
        term: null,
        uid: '',
        log: ''
      };
      this.log[cmd] = task;
    }

    return task[projPath];
  }

  setTask(cmd, projPath, content) {
    const task = this.getTask(cmd, projPath);
    this.log[cmd][projPath] = Object.assign(task, content);
  }

  writeLog(cmd, projPath, buf) {
    const str = iconv.decode(new Buffer(buf), config.getItem('ENCODE'));
    const task = this.getTask(cmd, projPath);
    // task.log += ansiHTML(str.replace(/\n/g, '<br>'));
    task.log += str;
    this.log[cmd][projPath] = task;
    return task.log;
  }

  clearTerm(cmd, projPath) {
    this.setTask(cmd, projPath, {
      term: null,
      uid: ''
    });
  }

  clearLog(cmd, projPath) {
    this.setTask(cmd, projPath, {
      log: ''
    });
  }

  getlog() {
    return this.log;
  }
}

export default new TaskLog();
