# babel

Babel plugin for jpex

## usage

Jpex uses a babel plugin to infer type interfaces. Your babel config should look something like this:

```js
{
  presets: [ '@babel/preset-typescript' ],
  plugins: [ 'jpex/babel-plugin' ]
}
```

## options

### identifier

```ts
string | string[]
```

The variable name of your `jpex` instance that the babel plugin should look for. By default it is just `jpex`.

For example in your app you may have something like:

```ts
const ioc = jpex.extend();

ioc.factory<Foo>(fooFn);
```

Then you should set the identifier property to `'ioc'` or `[ 'ioc', 'jpex' ]`

### publicPath

```ts
string | boolean;
```

The default behavior when creating string literals for types is to use the file path + the type name.

For example, if you import `MyDep` from `'src/types/common'`, jpex will name it `type:/src/types/common/MyDep`.

However, sometimes this is not ideal, such as when creating a node module package. (When you import a type from a node module, jpex will just use the package name as the file path)

`publicPath` allows you to set the path prefix. For example, setting it to `myPackageName` would result in a naming scheme of `type:/myPackageName/MyDep`.

If you set `publicPath` to `true`, it will attempt to load your `package.json` and read the `name` property.

### pathAlias

```ts
{
  [key: string]: string
}
```

Creates aliases for certain paths. This is currently a very basic implementation. If an import starts with a pathAlias, it'll replace it with the given alias.

For example:

```js
{
  '@': '/src'
}
```

Will convert

```ts
import { MyService } from "@/services";
```

into

```ts
import { MyService } from "/src/services";
```

This is only in terms of resolving a dependency's name, it doesn't actually update the import path.

### omitIndex

```ts
boolean;
```

When registering a dependency in an index file, the index will be omitted.

For example:

```ts
// /src/services/index.ts

type MyService = any;

jpex.service<MyService>(myService);
```

This would normally produce a type name of `type:/src/services/index/MyService`. With omitIndex it will create `type:/src/services/MyService`.
