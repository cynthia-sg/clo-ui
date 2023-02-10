import isUndefined from 'lodash/isUndefined';

import { Alert } from './AlertController';

const DEFAULT_TIME = 5 * 1000; //5s

interface AlertUpdatesHandler {
  updateAlertWrapper(alert: Alert | null): void;
}

class AlertDispatcher {
  private updatesHandler?: AlertUpdatesHandler;
  private visibleAlert: Alert | null = null;
  private timeout?: NodeJS.Timeout;

  public subscribe(updatesHandler: AlertUpdatesHandler) {
    this.updatesHandler = updatesHandler;
  }

  public postAlert(alert: Alert | null) {
    this.visibleAlert = alert;
    this.dismissAlert();
    if (this.updatesHandler) {
      this.updatesHandler.updateAlertWrapper(this.visibleAlert);
    }
  }

  private dismissAlert() {
    this.clearTimeout();
    if (this.visibleAlert && (isUndefined(this.visibleAlert.autoClose) || this.visibleAlert.autoClose)) {
      this.timeout = setTimeout(() => {
        this.postAlert(null);
      }, this.visibleAlert.dismissOn || DEFAULT_TIME);
    }
  }

  private clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}

export const alertDispatcher = new AlertDispatcher();
