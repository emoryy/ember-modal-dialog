import Ember from 'ember';
import ModalDialog from './modal-dialog';
import layout from '../templates/components/tether-dialog';

const { dasherize } = Ember.String;
const { $, computed, get, guidFor } = Ember;

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

export default ModalDialog.extend({
  layout,

  parentIdClass: Ember.computed(function() {
    return guidFor(this);
  }),

  didInsertElement() {
    if (!this.get('clickOutsideToClose')) {
      return;
    }

    const handleClick = (event) => {
      const exception = this.get('clickOutSideToCloseException');
      const eventTarget = $(event.target);
      const clickedOnDialog = eventTarget.closest(`.${guidFor(this)}`).length;
      const clickedOnException = exception && eventTarget.closest(exception).length;
      if (!clickedOnDialog && !clickedOnException) {
        this.send('close');
      }
    };
    const registerClick = () => $(document).on(`click.ember-modal-dialog-${guidFor(this)}`, handleClick);

    // setTimeout needed or else the click handler will catch the click that spawned this modal dialog
    setTimeout(registerClick);

    if (isIOS) {
      const registerTouch = () => $(document).on(`touchend.ember-modal-dialog-${guidFor(this)}`, handleClick);
      setTimeout(registerTouch);
    }
  },

  targetAttachmentClass: computed('targetAttachment', function() {
    let targetAttachment = this.get('targetAttachment') || '';
    return `ember-modal-dialog-target-attachment-${dasherize(targetAttachment)}`;
  }),

  targetAttachment: 'middle center',
  attachment: 'middle center',
  hasOverlay: true,
  target: 'viewport', // element, css selector, view instance, 'viewport', or 'scroll-handle'

  tetherClassPrefix: 'ember-tether',
  // offset - passed in
  // targetOffset - passed in
  // targetModifier - passed in

  makeOverlayClickableOnIOS: Ember.on('didInsertElement', function() {
    if (isIOS && get(this, 'hasOverlay')) {
      Ember.$('div[data-ember-modal-dialog-overlay]').css('cursor', 'pointer');
    }
  })

});
