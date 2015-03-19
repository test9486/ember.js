import run from "ember-metal/run_loop";
import View from "ember-views/views/view";

QUnit.module("Ember.View additions to run queue");

QUnit.skip("View hierarchy is done rendering to DOM when functions queued in afterRender execute", function() {
  var didInsert = 0;
  var childView = View.create({
    elementId: 'child_view',
    didInsertElement() {
      didInsert++;
    }
  });
  var parentView = View.create({
    elementId: 'parent_view',
    render(buffer) {
      this.appendChild(childView);
    },
    didInsertElement() {
      didInsert++;
    }
  });

  run(function() {
    parentView.appendTo('#qunit-fixture');
    run.schedule('afterRender', this, function() {
      equal(didInsert, 2, 'all didInsertElement hooks fired for hierarchy');
    });
  });

  run(function() {
    parentView.destroy();
  });
});
