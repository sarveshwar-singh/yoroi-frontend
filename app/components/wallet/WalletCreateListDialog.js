// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { defineMessages, intlShape } from 'react-intl';
import DialogCloseButton from '../widgets/DialogCloseButton';
import Dialog from '../widgets/Dialog';
import styles from './WalletCreateDialog.scss';

import environment from '../../environment';

const messages = defineMessages({
  dialogTitle: {
    id: 'wallet.create.dialog.title',
    defaultMessage: '!!!Create a new wallet',
  },
  walletName: {
    id: 'wallet.create.dialog.name.label',
    defaultMessage: '!!!Wallet name',
  },
  walletTabsRecommended: {
    id: 'wallet.create.tabs.recommended.title',
    defaultMessage: '!!!Recommended',
  },
  walletTabsAdvanced: {
    id: 'wallet.create.tabs.advanced.title',
    defaultMessage: '!!!Advanced',
  },
  walletMnemonicTitle: {
    id: 'wallet.create.type.mnemonic.title',
    defaultMessage: '!!!Wallet from 15 mnemonic words',
  },
  walletMasterTitle: {
    id: 'wallet.create.type.master.title',
    defaultMessage: '!!!Master Key',
  },
  walletPaperTitle: {
    id: 'wallet.create.type.paper.title',
    defaultMessage: '!!!Paper Wallet',
  },
  walletBusinessTitle: {
    id: 'wallet.create.type.business.title',
    defaultMessage: '!!!Business Wallet',
  },
});

type Props = {
  onCancel: Function,
  onCreate: Function,
  classicTheme: boolean
};

@observer
export default class WalletCreateListDialog extends Component<Props> {
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { intl } = this.context;
    const { onCancel, onCreate, classicTheme } = this.props;
    const dialogClasses = classnames([
      styles.component,
      'WalletCreateDialog',
    ]);

    return (
      <Dialog
        className={dialogClasses}
        title={intl.formatMessage(messages.dialogTitle)}
        closeOnOverlayClick={false}
        onClose={onCancel}
        closeButton={<DialogCloseButton />}
        classicTheme={classicTheme}
      >
        <div className={styles.tabs}>
          <button type="button" className={`${styles.tabsLink} ${styles.active}`}>{intl.formatMessage(messages.walletTabsRecommended)}</button>
          <button type="button" className={styles.tabsLink}>{intl.formatMessage(messages.walletTabsAdvanced)}</button>
        </div>
        <div className={styles.tabsContent}>
          <ul className={styles.walletTypeList}>
            <li className={styles.walletTypeListItem}>
              <button type="button" onClick={onCreate} className={styles.walletType}>
                <div className={`${styles.walletTypeImg} ${styles.mnemonic}`} />
                <h3 className={styles.walletTypeTitle}>
                  {intl.formatMessage(messages.walletMnemonicTitle)}
                </h3>
                <p className={styles.walletTypeDesc} />
              </button>
            </li>
            {!environment.isMainnet() &&
              <li className={styles.walletTypeListItem}>
                <button type="button" className={styles.walletType}>
                  <div className={`${styles.walletTypeImg} ${styles.master}`} />
                  <h3 className={styles.walletTypeTitle}>
                    {intl.formatMessage(messages.walletMasterTitle)}
                  </h3>
                  <p className={styles.walletTypeDesc} />
                </button>
              </li>
            }
            {!environment.isMainnet() &&
              <li className={styles.walletTypeListItem}>
                <button type="button" className={styles.walletType}>
                  <div className={`${styles.walletTypeImg} ${styles.paper}`} />
                  <h3 className={styles.walletTypeTitle}>
                    {intl.formatMessage(messages.walletPaperTitle)}
                  </h3>
                  <p className={styles.walletTypeDesc} />
                </button>
              </li>
            }
            {!environment.isMainnet() &&
              <li className={styles.walletTypeListItem}>
                <button type="button" className={styles.walletType}>
                  <div className={`${styles.walletTypeImg} ${styles.business}`} />
                  <h3 className={styles.walletTypeTitle}>
                    {intl.formatMessage(messages.walletBusinessTitle)}
                  </h3>
                  <p className={styles.walletTypeDesc} />
                </button>
              </li>
            }
          </ul>
        </div>
      </Dialog>
    );
  }

}
