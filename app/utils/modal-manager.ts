import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export interface ModalConfirmation {
  reason: 'confirmed' | 'cancelled';
}

export default class ModalManager {
  #promise: Promise<ModalConfirmation> | null = null;
  #resolve: (result: ModalConfirmation) => void = () => {};
  @tracked isOpen = false;

  @action
  open(): Promise<ModalConfirmation> {
    this.#promise ??= new Promise<ModalConfirmation>((resolve) => {
      this.#resolve = resolve;
      this.isOpen = true;
    }).finally(() => {
      this.isOpen = false;
      this.#promise = null;
    });

    return this.#promise;
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
