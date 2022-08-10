import { helper } from '@ember/component/helper';

type DocumentDependency = Pick<Document, 'querySelector'>;

interface Args {
  Positional: [string];
  Named: {
    document?: DocumentDependency;
  };
}

export default helper(function querySelector(
  [selector]: Args['Positional'],
  { document: doc = document }: Args['Named']
) {
  return doc.querySelector(selector);
});
