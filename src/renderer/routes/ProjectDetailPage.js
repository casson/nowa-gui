import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { shell, remote } from 'electron';
import { join } from 'path';
import classNames from 'classnames';
import Layout from 'antd/lib/layout';
import Tooltip from 'antd/lib/tooltip';
import Spin from 'antd/lib/spin';
import i18n from 'i18n';

import { getAddressByUID, delay } from 'gui-util';
import ProjectDetailTab from '../components/ProjectDetail/Tab';
import ProjectDetailImportLog from '../components/ProjectDetail/ImportLog';
import ProjectDetailImportInfo from '../components/ProjectDetail/ImportInfo';

const { Content } = Layout;

const { command } = remote.getGlobal('services');


const ProjectDetailPage = ({
    current, logType, dispatch, commands, registry, registryList
  }) => {
  let buildBtn;
  let startBtn;
  const { start, path, pkg, loadingStep, isNowa } = current;
  const hasBuildFunc = 'scripts' in pkg && 'build' in pkg.scripts;
  const hasStartFunc = 'scripts' in pkg && 'start' in pkg.scripts;
  const tabProps = { current, logType, dispatch, commands: commands[path], registry };
  
  const startProj = () => dispatch({ type: 'task/start', payload: { project: current } });
  const buildProj = () => dispatch({ type: 'task/execCustomCmd', payload: { type: 'build', name: path } });
  const stopProj = () => dispatch({ type: 'task/stop', payload: { project: current } });
  const openEditor = () => dispatch({ type: 'task/openEditor', payload: { project: current } });
  const compassProj = () => {
    if (isNowa && start) {
      const task = remote.require('./services/task');
      const { uid } = task.getTask('start', path);
      delay(1000).then(shell.openExternal(getAddressByUID(uid)));
    }
  };

  const openTerminal = () => command.openTerminal(current.path);
  
  if (hasStartFunc) {
    startBtn = !start
      ? (<div className="opt start" onClick={startProj}>
          <i className="iconfont icon-play" /><br />{i18n('task.start')}
        </div>)
      : (<div className="opt" onClick={stopProj}>
          <i className="iconfont icon-stop" /><br />{i18n('task.stop')}
        </div>);
  } else {
    startBtn = (
      <Tooltip placement="top" title={i18n('Cannot find scripts.start in pacakge.json')} >
        <div className="opt start disable">
          <i className="iconfont icon-play" /><br />{i18n('task.start')}
        </div>
      </Tooltip>
    );
  }

  if (hasBuildFunc) {
    buildBtn = (
      <div className="opt" onClick={buildProj}>
        <i className="iconfont icon-similarproduct" /><br />{i18n('task.compile')}
      </div>);
  } else {
    buildBtn = (
      <Tooltip placement="top" title={i18n('Cannot find scripts.build in pacakge.json')} >
        <div className="opt disable">
          <i className="iconfont icon-similarproduct" /><br />{i18n('task.compile')}
        </div>
      </Tooltip>
    );
  }

  return (
    <Content className="ui-content proj-detail">
      { !loadingStep && <ProjectDetailTab {...tabProps} /> }
      { !loadingStep && <div className="opt-grp">
          { startBtn }
          { <div className={classNames({
            opt: true,
            disable: !start || !isNowa
          })} onClick={compassProj} >
              <i className="iconfont icon-compass" /><br />{i18n('task.compass')}
            </div>
          }
          { buildBtn }
          <div className="opt " onClick={openEditor}>
            <i className="iconfont icon-code" /><br />{i18n('task.editor')}
          </div>
          <div className="opt " onClick={openTerminal}>
            <i className="iconfont icon-terminal" /><br />{i18n('task.terminal')}
          </div>
        </div> }
      { loadingStep === 1 && <ProjectDetailImportInfo project={current} dispatch={dispatch} registryList={registryList} />}
      { loadingStep === 2 && <ProjectDetailImportLog filePath={path} dispatch={dispatch} />}
    </Content>
  );
};


ProjectDetailPage.propTypes = {
  logType: PropTypes.string.isRequired,
  registry: PropTypes.string.isRequired,
  registryList: PropTypes.array.isRequired,
  commands: PropTypes.object,
  current: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(({ project, task, setting }) => ({
  current: project.current,
  commands: task.commands,
  logType: task.logType,
  registry: setting.registry,
  registryList: setting.registryList,
}))(ProjectDetailPage);
