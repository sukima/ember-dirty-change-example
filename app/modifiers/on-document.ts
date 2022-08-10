import { modifier } from 'ember-modifier';

type Listener = (event: Event) => void;
type DocumentDependency = Pick<Document,
  | 'addEventListener'
  | 'removeEventListener'
>;

interface Args {
  Positional: [string, Listener];
  Named: {
    document?: DocumentDependency;
  };
}

function attachEventModifier(
  element: Element,
  [eventName, listener]: Args['Positional'],
  { document: doc = window.document }: Args['Named']
) {
  const handler = (event: Event) => {
    if (!element.contains(event.target as Element)) {
      event.preventDefault();
      listener(event);
    }
  };

  doc.addEventListener(eventName, handler, { capture: true });
  return () => doc.removeEventListener(eventName, handler, { capture: true });
}

export default modifier(attachEventModifier, { eager: false });
