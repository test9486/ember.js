/**
@module ember
@submodule ember-htmlbars
*/

import { readViewFactory } from "ember-views/streams/utils";
import CollectionView from "ember-views/views/collection_view";
import ComponentNode from "ember-htmlbars/system/component-node";
import objectKeys from "ember-metal/keys";

export default {
  setupState(state, env, scope, params, hash) {
    var read = env.hooks.getValue;

    return {
      componentNode: state.componentNode,
      parentView: read(scope.locals.view),
      viewClassOrInstance: getView(read(params[0]), env.container)
    };
  },

  rerender(morph, env, scope, params, hash, template, inverse, visitor) {
    // If the hash is empty, the component cannot have extracted a part
    // of a mutable param and used it in its layout, because there are
    // no params at all.
    if (objectKeys(hash).length) {
      return morph.state.componentNode.rerender(env, hash, visitor, true);
    }
  },

  render(node, env, scope, params, hash, template, inverse, visitor) {
    var state = node.state;
    var parentView = state.parentView;

    var options = { component: node.state.viewClassOrInstance, layout: null };
    if (template) {
      options.createOptions = {
        _itemViewTemplate: template && { raw: template },
        _itemViewInverse: inverse && { raw: inverse }
      };
    }

    var componentNode = ComponentNode.create(node, env, hash, options, parentView, null, scope, template);
    state.componentNode = componentNode;

    if (hash.itemView) {
      hash.itemViewClass = hash.itemView;
    }

    componentNode.render(env, hash, visitor);
  }
};

function getView(viewPath, container) {
  var viewClassOrInstance;

  if (!viewPath) {
    viewClassOrInstance = CollectionView;
  } else {
    viewClassOrInstance = readViewFactory(viewPath, container);
  }

  return viewClassOrInstance;
}
