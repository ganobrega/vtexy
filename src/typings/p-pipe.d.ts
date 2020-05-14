declare module 'p-pipe' {
    export default function (
      ...streams: Array<NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream>
    ): Promise<void>
  }