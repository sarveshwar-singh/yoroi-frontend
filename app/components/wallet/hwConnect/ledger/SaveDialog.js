// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import classnames from 'classnames';
import SvgInline from 'react-svg-inline';
import { Input } from 'react-polymorph/lib/components/Input';
import { InputSkin } from 'react-polymorph/lib/skins/simple/InputSkin';
import { InputOwnSkin } from '../../../../themes/skins/InputOwnSkin';

import globalMessages from '../../../../i18n/global-messages';
import LocalizableError from '../../../../i18n/LocalizableError';

import Dialog from '../../../widgets/Dialog';
import DialogCloseButton from '../../../widgets/DialogCloseButton';

import ProgressStepBlock from '../common/ProgressStepBlock';
import HelpLinkBlock from './HelpLinkBlock';
import HWErrorBlock from '../common/HWErrorBlock';

import saveLoadImage from '../../../../assets/images/hardware-wallet/ledger/save-load-modern.inline.svg';
import saveErrorImage from '../../../../assets/images/hardware-wallet/ledger/save-error-modern.inline.svg';

import saveLoadSVG from '../../../../assets/images/hardware-wallet/ledger/save-load.inline.svg';
import saveErrorSVG from '../../../../assets/images/hardware-wallet/ledger/save-error.inline.svg';

import ReactToolboxMobxForm from '../../../../utils/ReactToolboxMobxForm';
import { isValidWalletName } from '../../../../utils/validations';

import { ProgressInfo, StepState } from '../../../../types/HWConnectStoreTypes';

import { Logger } from '../../../../utils/logging';

import styles from '../common/SaveDialog.scss';
import headerMixin from '../../../mixins/HeaderBlock.scss';
import config from '../../../../config';

const saveStartSVG = saveLoadSVG;

const messages = defineMessages({
  saveWalletNameInputBottomInfo: {
    id: 'wallet.connect.ledger.dialog.step.save.walletName.info',
    defaultMessage: '!!!We have fetched Ledger device’s name for you; you can use as it is or assign a different name.',
  },
});

type Props = {
  progressInfo: ProgressInfo,
  error: ?LocalizableError,
  isActionProcessing: boolean,
  defaultWalletName: string,
  submit: Function,
  cancel: Function,
  classicTheme: boolean,
};

@observer
export default class SaveDialog extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired
  };

  form: typeof ReactToolboxMobxForm;

  componentWillMount() {
    const { intl } = this.context;
    const { defaultWalletName } = this.props;

    this.form = new ReactToolboxMobxForm({
      fields: {
        walletName: {
          label: intl.formatMessage(globalMessages.hwConnectDialogSaveWalletNameInputLabel),
          placeholder: intl.formatMessage(globalMessages.hwConnectDialogSaveWalletNameInputPH),
          value: defaultWalletName,
          validators: [({ field }) => (
            [
              isValidWalletName(field.value),
              intl.formatMessage(globalMessages.invalidWalletName)
            ]
          )],
        },
      },
    }, {
      options: {
        validateOnChange: true,
        validationDebounceWait: config.forms.FORM_VALIDATION_DEBOUNCE_WAIT,
      },
    });
  }

  render() {
    const { intl } = this.context;
    const { progressInfo, isActionProcessing, error, cancel, classicTheme } = this.props;

    const headerBlockClasses = classicTheme
      ? classnames([headerMixin.headerBlockClassic, styles.headerSaveBlockClassic])
      : classnames([headerMixin.headerBlock, styles.headerSaveBlock]);
    const middleBlockClasses = classicTheme ? styles.middleBlockClassic : styles.middleBlock;
    const middleBlockErrorClasses = classicTheme ? styles.middleSaveErrorBlockClassic : null;
    const walletNameFieldClasses = classnames([
      'walletName',
      styles.walletName,
    ]);
    const walletNameField = this.form.$('walletName');

    const walletNameBlock = (
      <div className={headerBlockClasses}>
        <Input
          className={walletNameFieldClasses}
          {...walletNameField.bind()}
          error={walletNameField.error}
          skin={classicTheme ? InputSkin : InputOwnSkin}
        />
        <span>{intl.formatMessage(messages.saveWalletNameInputBottomInfo)}</span>
      </div>);

    let middleBlock = null;

    switch (progressInfo.stepState) {
      case StepState.LOAD:
        middleBlock = (
          <div className={classnames([middleBlockClasses, styles.middleSaveLoadBlock])}>
            <SvgInline svg={classicTheme ? saveLoadSVG : saveLoadImage} />
          </div>);
        break;
      case StepState.PROCESS:
        middleBlock = (
          <div className={classnames([middleBlockClasses, styles.middleSaveStartProcessBlock])}>
            <SvgInline svg={classicTheme ? saveStartSVG : saveLoadImage} />
          </div>);
        break;
      case StepState.ERROR:
        middleBlock = (
          <div className={classnames([middleBlockClasses, middleBlockErrorClasses])}>
            <SvgInline svg={classicTheme ? saveErrorSVG : saveErrorImage} />
          </div>);
        break;
      default:
        Logger.error('ledger::ConnectDialog::render: something unexpected happened');
        break;
    }

    const dailogActions = [{
      className: isActionProcessing ? styles.processing : null,
      label: intl.formatMessage(globalMessages.hwConnectDialogSaveButtonLabel),
      primary: true,
      disabled: isActionProcessing,
      onClick: this.save
    }];

    return (
      <Dialog
        className={classnames([styles.component, 'SaveDialog'])}
        title={intl.formatMessage(globalMessages.ledgerConnectAllDialogTitle)}
        actions={dailogActions}
        closeOnOverlayClick={false}
        onClose={cancel}
        closeButton={<DialogCloseButton />}
        classicTheme={classicTheme}
      >
        <ProgressStepBlock progressInfo={progressInfo} classicTheme={classicTheme} />
        {walletNameBlock}
        {middleBlock}
        <HWErrorBlock progressInfo={progressInfo} error={error} classicTheme={classicTheme} />
        <HelpLinkBlock progressInfo={progressInfo} />
      </Dialog>);
  }

  save = async () => {
    this.form.submit({
      onSuccess: async (form) => {
        const { walletName } = form.values();
        this.props.submit(walletName);
      }
    });
  }
}
