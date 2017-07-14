/* @flow */
/**
 * TEMP_FIX (babel 6.x) for import { type A, type B } from 'moduleA';
 * getting converted to  "import 'moduleA';" but it should be removed
 *
 * the current fix is already present in babel plugin v7 so remove
 * when upgrade to babel 7
 */
import syntaxFlow from 'babel-plugin-syntax-flow';

export default function transformFlowStripTypesImportFix() {
  return {
    inherits: syntaxFlow,

    visitor: {
      ImportDeclaration(path: Object) {
        if (!path.node.specifiers.length) {
          return;
        }

        let typeCount = 0;

        path.node.specifiers.forEach(({ importKind }) => {
          if (importKind === 'type' || importKind === 'typeof') {
            typeCount += 1;
          }
        });

        if (typeCount === path.node.specifiers.length) {
          path.remove();
        }
      },
    },
  };
}
