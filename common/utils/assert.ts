// https://github.com/microsoft/TypeScript/pull/33622
export default function assert<T>(_arg: any): asserts _arg is T {}
