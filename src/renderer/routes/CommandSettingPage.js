import React, { PropTypes } from 'react';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { connect } from 'dva';

import i18n from 'i18n-renderer-nowa';
import GlobalCommandsForm from '../components/GlobalCommands/Form';
import GlobalCommandsTable from '../components/GlobalCommands/Table';


const CommandSettingPage = ({
  dispatch
}) => {
  const goBack = () => dispatch({ type: 'layout/goBack' });
  return (
    <Row className="commands">
      <h2 className="commands-title">{i18n('cmd.global.title')}</h2>
      <Col offset={1}>
        <p className="commands-detail">{i18n('cmd.global.tip')}</p>
        <GlobalCommandsForm />
        <GlobalCommandsTable />
        <Button type="default" size="default" onClick={goBack}>{i18n('form.back')}</Button>
      </Col>
    </Row>
  );
};

CommandSettingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CommandSettingPage);

