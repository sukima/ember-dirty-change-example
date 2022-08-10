import ModalManager from './modal-manager';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

type WindowDependency = Pick<Window,
  | 'addEventListener'
  | 'removeEventListener'
>;

let beforeUnloadEnabled = true;

export function disableBeforeUnload() {
  beforeUnloadEnabled = false;
}

export function enableBeforeUnload() {
  beforeUnloadEnabled = true;
}

export default class UnloadManager {
  confirmationModal = new ModalManager();
  @tracked hasChanges = false;

  constructor(private _window: WindowDependency = window) {}

  get showConfirmation() {
    return this.confirmationModal.isOpen;
  }

  @action
  async confirmAbandonChanges() {
    let result = await this.confirmationModal.open();
    if (result.reason === 'confirmed') this.resetChanges();
    return result;
  }

  @action
  registerChanges() {
    if (beforeUnloadEnabled) {
      this._window.addEventListener('beforeunload', this.beforeunload);
    }
    this.hasChanges = true;
  }

  @action
  resetChanges() {
    this._window.removeEventListener('beforeunload', this.beforeunload);
    this.hasChanges = false;
  }

  @action
  beforeunload(event: Event) {
    event.preventDefault(); // FireFox
    event.returnValue = true; // Chrome
    return 'true'; // Safari
  }
}
