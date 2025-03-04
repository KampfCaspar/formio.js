export default {
  title: 'Test',
  name: 'test',
  path: 'test',
  type: 'form',
  display: 'form',
  tags: [],
  components: [
    {
      label: 'Text Field',
      applyMaskOn: 'change',
      tableView: true,
      validateWhenHidden: false,
      key: 'textField',
      type: 'textfield',
      input: true,
    },
    {
      type: 'button',
      label: 'Submit',
      key: 'submit',
      disableOnInvalid: true,
      input: true,
      tableView: false,
    },
  ],
  controller: 'data.textField = data.textField + \'changed\';\ninstance.redraw();',
  revisions: '',
  submissionRevisions: '',
  _vid: 0,
};
