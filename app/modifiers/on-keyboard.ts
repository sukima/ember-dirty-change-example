import { modifier } from 'ember-modifier';

type Callback = (event: KeyboardEvent) => void;

export interface Args {
  Positional: [string, Callback];
  Named: {
    down?: boolean;
  };
}

export default modifier(function (
  container: HTMLElement,
  [key, callback]: Args['Positional'],
  { down = false }: Args['Named']
) {
  const eventName = down ? 'keydown' : 'keyup';
  const handler = (event: KeyboardEvent) => {
    if (event.key === key) callback(event);
  };
  container.addEventListener(eventName, handler);
  return () => container.removeEventListener(eventName, handler);
});
