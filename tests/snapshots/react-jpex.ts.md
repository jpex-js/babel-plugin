# Snapshot report for `tests/react-jpex.ts`

The actual snapshot is saved in `react-jpex.ts.snap`.

Generated by [AVA](https://avajs.dev).

## encase

> Snapshot 1

    `import { useResolve, encase } from 'react-jpex';␊
    const Component = encase(["type:/code/Foo", "type:/code/Bar"], (foo, bar) => props => {␊
      const baz = useResolve("type:/code/Baz");␊
      return foo + bar + baz;␊
    });`