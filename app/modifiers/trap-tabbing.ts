/* global Iterable */
import { modifier } from 'ember-modifier';

const tabIndexes = new WeakMap();

interface SelectAll {
  (selector: string): Iterable<HTMLElement>;
}

export interface Args {
  Positional: [];
  Named: {
    selectAll?: SelectAll;
  };
}

function* findTabableElements(
  selectAll: SelectAll = (selector: string): Iterable<HTMLElement> =>
    document.querySelectorAll(selector)
): Iterable<HTMLElement> {
  yield* selectAll('a[href]');
  yield* selectAll('area[href]');
  yield* selectAll('input:not([disabled])');
  yield* selectAll('select:not([disabled])');
  yield* selectAll('textarea:not([disabled])');
  yield* selectAll('button:not([disabled])');
  yield* selectAll('iframe');
  yield* selectAll('object');
  yield* selectAll('embed');
  yield* selectAll('*[tabindex]');
  yield* selectAll('*[contenteditable]');
}

export function confineTabbing(container: Element, selectAll?: SelectAll) {
  let firstElementWithin = null;
  let tabableElements = new Set<HTMLElement>(findTabableElements(selectAll));
  for (let element of tabableElements) {
    tabIndexes.set(element, element.tabIndex);
    if (container.contains(element)) {
      firstElementWithin ??= element;
    } else {
      element.tabIndex = -1;
    }
  }
  return firstElementWithin;
}

export function releaseTabbing(selectAll?: SelectAll) {
  let tabableElements = new Set<HTMLElement>(findTabableElements(selectAll));
  for (let element of tabableElements) {
    element.tabIndex = tabIndexes.get(element) || 0;
  }
}

export default modifier(function (
  container: Element,
  _: Args['Positional'],
  { selectAll }: Args['Named']
) {
  confineTabbing(container, selectAll);
  return () => releaseTabbing(selectAll);
});
