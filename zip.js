import archiver from 'archiver'
import { createWriteStream } from 'fs'
import fs from 'fs/promises'
import { glob } from 'glob'
import isGlob from 'is-glob'
import path from 'path'

export const COMPRESSION_LEVEL = {
  uncompressed: 0,
  medium: 5,
  high: 9,
}

/**
 * Options to pass in to zip a folder
 * compression default is 'high'
 */
// export type zipFolderOptions = {
//     compression?: COMPRESSION_LEVEL;
//     customWriteStream?: WriteStream;
//     destPath?: string;
// };

export class Zip {
  /**
   * Tars a given folder or a glob into a gzipped tar archive.
   * If no zipFolderOptions are passed in, the default compression level is high.
   * @param src can be a string path or a glob
   * @param tarFilePath path to the zip file
   * @param zipFolderOptions
   */
  static async tar(src, tarFilePath, zipFolderOptions) {
    const o = {
      compression: COMPRESSION_LEVEL.high,
    }

    if (o.compression === COMPRESSION_LEVEL.uncompressed) {
      await Zip.compress({ src, tarFilePath, format: 'tar', zipFolderOptions })
    } else {
      await Zip.compress({
        src,
        targetFilePath: tarFilePath,
        format: 'tar',
        zipFolderOptions,
        archiverOptions: {
          gzip: true,
          gzipOptions: {
            level: o.compression,
          },
        },
      })
    }
  }

  /**
   * Zips a given folder or a glob into a zip archive.
   * If no zipFolderOptions are passed in, the default compression level is high.
   * @param src can be a string path or a glob
   * @param zipFilePath path to the zip file
   * @param zipFolderOptions
   */
  static async zip(src, zipFilePath, zipFolderOptions) {
    const o = zipFolderOptions || {
      compression: COMPRESSION_LEVEL.high,
    }

    if (o.compression === COMPRESSION_LEVEL.uncompressed) {
      await Zip.compress({
        src,
        targetFilePath: zipFilePath,
        format: 'zip',
        zipFolderOptions,
        archiverOptions: {
          store: true,
        },
      })
    } else {
      await Zip.compress({
        src,
        targetFilePath: zipFilePath,
        format: 'zip',
        zipFolderOptions,
        archiverOptions: {
          zlib: {
            level: o.compression,
          },
        },
      })
    }
  }

  static async compress({
    src,
    targetFilePath,
    format,
    zipFolderOptions,
    archiverOptions,
  }) {
    let output
    const globList = []

    if (!zipFolderOptions?.customWriteStream && targetFilePath) {
      const targetBasePath = path.dirname(targetFilePath)

      if (targetBasePath === src) {
        throw new Error('Source and target folder must be different.')
      }

      try {
        if (!isGlob(src)) {
          await fs.access(src, fs.constants.R_OK) //eslint-disable-line no-bitwise
        }
        await fs.access(targetBasePath, fs.constants.R_OK | fs.constants.W_OK) //eslint-disable-line no-bitwise
      } catch (e) {
        throw new Error(`Permission error: ${e.message}`)
      }

      if (isGlob(src)) {
        for (const globPart of src.split(',')) {
          // @ts-ignore
          globList.push(...(await glob(globPart.trim())))
        }
        if (globList.length === 0) {
          throw new Error(`No glob match found for "${src}".`)
        }
      }

      output = createWriteStream(targetFilePath)
    } else if (zipFolderOptions && zipFolderOptions.customWriteStream) {
      output = zipFolderOptions.customWriteStream
    } else {
      throw new Error(
        'You must either provide a target file path or a custom write stream to write to.'
      )
    }

    const zipArchive = archiver(format, archiverOptions || {})

    return new Promise(async (resolve, reject) => {
      output.on('close', resolve)
      output.on('error', reject)

      zipArchive.pipe(output)

      // if (zipFolderOptions?.excludes) {
      //   console.log('exclude', zipFolderOptions.excludes)
      //   console.log('glob', globList, isGlob(src))
      //   // zipArchive.glob('**/*', { ignore: zipFolderOptions.excludes })
      //   zipArchive.glob('**/*', zipFolderOptions.excludes)
      // }
      if (isGlob(src)) {
        for (const file of globList) {
          if ((await fs.lstat(file)).isFile()) {
            const content = await fs.readFile(file)
            zipArchive.append(content, {
              name: file,
            })
          }
        }
      } else {
        zipArchive.directory(
          src,
          zipFolderOptions?.destPath || false,
          (val) => {
            if (!!zipFolderOptions.excludes) {
              // console.log('check', val.name)
              let found = false
              // zipFolderOptions.excludes.map((i) => {
              for (let i = 0; i < zipFolderOptions.excludes.length; i++) {
                let curr = zipFolderOptions.excludes[i]
                if (val.name && val.name.includes(curr)) {
                  // console.log('exclude ', val.name)
                  found = true
                  break
                }
              }
              console.log('check', found ? val.name + '=> X' : val.name)
              // })
              return found ? false : val
              // return false
            } else return val
          }
        )
      }
      await zipArchive.finalize()
    })
  }
}

export const zip = Zip.zip
export const tar = Zip.tar

zip(
  '/Volumes/3TB-MAC/work/0.Project/0.highmaru/autoservice/server/js-out/675547cfc17f63c2ba34969c',
  'a.zip',
  {
    excludes: ['node_modules/', 'logs/'],
  }
)
  .then((r) => {
    console.log('complete', r)
  })
  .catch((e) => {
    console.log('err', e)
  })
