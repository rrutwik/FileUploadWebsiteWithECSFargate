import logging
import boto3
from botocore.exceptions import ClientError
import random
import string

class s3Helper:
    def get_random_string(self, length):
        letters = string.ascii_lowercase
        return ''.join(random.choice(letters) for i in range(length))
    def upload_file_to_s3(self, file, bucketName, fileKey):
        """Upload a file to an S3 bucket
        :param file_name: File to upload
        :param bucket: Bucket to upload to
        :param object_name: S3 object name. If not specified then file_name is used
        :return: True if file was uploaded, else False
        """

        # Upload the file
        s3_client = boto3.client('s3')
        fileKey = self.get_random_string(15)+"/"+fileKey
        print(fileKey)
        try:
            response = s3_client.upload_fileobj(file, bucketName, fileKey)
        except ClientError as e:
            print(e)
            logging.error(e)
            return False
        return True