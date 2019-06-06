import Amplify from 'aws-amplify'
import AWSExports from '../aws-exports'

export default () => {
  Amplify.configure(AWSExports)
}
