import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ExampleFormComponent extends Component {
  @action
  doNothing(event: Event) {
    event.preventDefault();
  }
}
