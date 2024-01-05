// export AWS_PROFILE=highmaruapps
// import * as AWS from '@aws-sdk/client-batch'
const AWS = require('@aws-sdk/client-batch')
const client = new AWS.Batch({ region: 'ap-northeast-2' })
// const client = new AWS.Batch({ region: 'us-east-1' })

const params = {
  //   jobQueue: 'batchdemo-jobqueue',
  jobQueue:
    // 'arn:aws:batch:ap-northeast-2:252684154413:job-queue/batchdemo-jobqueue',
    // 'arn:aws:batch:us-east-1:294803780020:job-queue/olsawsbatchqueue',
    'olsawsbatch',
  // jobStatus: ['SUBMITTED', 'PENDING', 'RUNNABLE', 'STARTING', 'RUNNING','SUCCEEDED','FAILED'],
  jobStatus: 'SUCCEEDED',
}
async function test() {
  // async/await.
  //   try {
  //     const data = await client.listJobs(params)
  //     // process data.
  //     console.log('data', data)
  //   } catch (error) {
  //     // error handling.
  //     console.log('err', error)
  //   }
  const jobParam = {
    jobDefinition:
      // 'arn:aws:batch:us-east-1:294803780020:job-definition/olsawsbatch:1',
      // 'olsawsbatch:1',
      'olscommand:1',
    // jobQueue: 'arn:aws:batch:us-east-1:294803780020:job-queue/olsawsbatchqueue',
    jobQueue: 'olsawsbatch',
    jobName: 'SliceAndCompres',
    containerOverrides: {
      command: [
        'python',
        'command.py',
        'slice',
        '-l',
        '6',
        '-c',
        '1',
        '-d',
        '0.1',
        '-o',
        'out',
      ],
    },
    // jobName: 'Test_Png',
    // containerOverrides: {
    //   command: ['python', 'command.py', 'png', '-c', '1'],
    // },
  }
  client.submitJob(jobParam, (err, res) => {
    if (err) {
      console.log('Err]', err)
    } else {
      console.log('=>', res)
    }
  })

  // Promises.
  client
    .listJobs(params)
    .then((data) => {
      // process data.
      console.log('data2', data)
    })
    .catch((error) => {
      // error handling.
      console.log('err2', error)
    })
  //   client
  //     .submitJob({
  //       jobDefinition: 'frombatch:3',
  //       jobName: 'custom-command',
  //       jobQueue: 'batchdemo-jobqueue',
  //       containerOverrides: {
  //         command: ['echo', 'from nodejs'],
  //       },
  //     })
  //     .then((data) => {
  //       // process data.
  //       console.log('data3', data)
  //     })
  //     .catch((error) => {
  //       // error handling.
  //       console.log('err3', error)
  //     })
}

test()
