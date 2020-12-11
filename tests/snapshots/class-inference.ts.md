# Snapshot report for `tests/class-inference.ts`

The actual snapshot is saved in `class-inference.ts.snap`.

Generated by [AVA](https://avajs.dev).

## class-inference

> Snapshot 1

    `import jpex from 'jpex';␊
    ␊
    class Foo {␊
      constructor(window) {␊
        this.window = window;␊
      }␊
    ␊
    }␊
    ␊
    jpex.service("type:/code/Foo", ["type:global:Window"], Foo);␊
    jpex.service("type:/code/Bah", ["type:global:Window"], class Bah {␊
      constructor(window) {␊
        this.window = window;␊
      }␊
    ␊
    });␊
    const result = jpex.resolve("type:/code/Foo");`