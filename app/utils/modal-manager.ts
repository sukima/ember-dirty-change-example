import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export interface ModalConfirmation {
  reason: 'confirmed' | 'cancelled';
}

export default class ModalManager {
  #resolve: (result: ModalConfirmation) => void = () => {};
  @tracked isOpen = false;

  @action
  open(): Promise<ModalConfirmation> {
    return new Promise<ModalConfirmation>((resolve) => {
      this.#resolve = resolve;
      this.isOpen = true;
    }).finally(() => (this.isOpen = false));
  }

  @action
  confirm() {
    this.#resolve({ reason: 'confirmed' });
  }

  @action
  cancel() {
    this.#resolve({ reason: 'cancelled' });
  }
}
