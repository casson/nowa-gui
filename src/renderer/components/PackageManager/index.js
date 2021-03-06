import React, { Component, PropTypes } from 'react';
import { remote } from 'electron';
// import semver from 'semver';
import Message from 'antd/lib/message';
import Tabs from 'antd/lib/tabs';

import i18n from 'i18n';
import { REGISTRY_MAP } from 'gui-const';
import DependenceTable from './DependenceTable';

// const { registry } = remote.getGlobal('config');
const TabPane = Tabs.TabPane;


class PackageManager extends Component {
  constructor(props) {
    super(props);
    const dp = this.getInitDependencies(props.project.pkg);
    this.state = {
      activeKey: '1',
      ...dp,
    };
  }

  componentWillReceiveProps({ project, path }) {
    if (path !== this.props.project.path) {
      this.setState({ ...this.getInitDependencies(project.pkg) });
    }
  }

  getInitDependencies(pkg) {
    const { dependencies, devDependencies } = pkg;
    let dp1 = [];
    let dp0 = [];

    if (dependencies) {

      dp0 = Object.keys(dependencies).map(name => ({
        name,
        version: dependencies[name],
      }));
    }

    if (devDependencies) {
      dp1 = Object.keys(devDependencies).map(name => ({
        name,
        version: devDependencies[name],
      }));
    }

    return {
      dependencies: dp0,
      devDependencies: dp1,
    };
  }

  render() {
    const { activeKey, dependencies, devDependencies } = this.state;
    const { project, dispatch, globalRegistry } = this.props;
    const npm = REGISTRY_MAP[project.abc.npm] || project.registry || globalRegistry;

    const basicProps = {
      registry: npm,
      filePath: project.path,
      dispatch,
    };

    return (
      <div className="proj-setting">
        <Tabs type="card" className="proj-setting-tabs"
          defaultActiveKey={activeKey}
          onTabClick={index => this.setState({ activeKey: index })}
        >
          <TabPane tab="Dependencies" key="1">
            <DependenceTable source={dependencies} type="dependencies" {...basicProps} />
          </TabPane>
          <TabPane tab="Dev Dependencies" key="2">
            <DependenceTable source={devDependencies} type="devDependencies" {...basicProps} />
          </TabPane>
        </Tabs>
      </div>
    );
  }

}

PackageManager.propTypes = {
  project: PropTypes.shape({
    path: PropTypes.string,
    pkg: PropTypes.object,
    abc: PropTypes.object,
    registry: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  globalRegistry: PropTypes.string.isRequired,
};


export default PackageManager;