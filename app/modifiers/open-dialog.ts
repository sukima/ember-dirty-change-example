import { assert } from '@ember/debug';
import { modifier } from 'ember-modifier';

export default modifier(function (dialog: HTMLDialogElement) {
  assert(
    'open-dialog modifier must be aplied on a <dialog> element',
    dialog instanceof HTMLDialogElement
  );
  dialog.showModal();
  return () => dialog.close();
});
