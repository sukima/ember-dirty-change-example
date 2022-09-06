import Route from '@ember/routing/route';
import UnloadManager from 'ember-dirty-change-example/utils/unload-manager';
import { action } from '@ember/object';

import type RouterService from '@ember/routing/router-service';

type Resolved<P> = P extends Promise<infer T> ? T : P;
type Transition = ReturnType<RouterService['transitionTo']>;
export type Model = Resolved<ReturnType<BarRoute['model']>>;

export default class BarRoute extends Route {
  model() {
    let unloader = new UnloadManager();
    return { unloader };
  }

  @action
  async willTransition(transition: Transition) {
    let { unloader } = this.modelFor(this.routeName) as Model;
    if (!unloader.hasChanges) return;
    await transition.abort().catch(ignoreTransitionAbortedError);
    let { reason } = await unloader.confirmAbandonChanges();
    if (reason === 'confirmed')
      await transition.retry().catch(ignoreTransitionAbortedError);
  }
}

function ignoreTransitionAbortedError(error: unknown) {
  let name = error instanceof Error && error.name;
  if (name !== 'TransitionAborted') throw error;
}
