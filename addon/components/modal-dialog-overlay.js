import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['data-ember-modal-dialog-overlay'],
  'data-ember-modal-dialog-overlay': true,

  // trigger only when clicking the overlay itself, not its children
  click(event) {
    if (event.target === this.get('element')) {
      this.sendAction();
    }
  },

  didInsertElement: function(...args) {
    this._super(...args);
    if (!this.get('forTether')) {
      return;
    }

    const observer = new MutationObserver((mutationsList) => {
      const parentNode = this.element.parentNode;
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const transforms = parentNode.style.transform.match(/(\d*px)/g);
          this.element.style.transform =  `translateX(-${transforms[0]}) translateY(-${transforms[1]})`;
        }
      }
    });

    const config = { attributes: true };
    observer.observe(this.element.parentNode, config);
  },

});
