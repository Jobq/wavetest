S3 = if FileTest.exists?(File.join(Rails.root, 'config', 's3.yml'))
  YAML.load_file(File.join(Rails.root, 'config', 's3.yml'))
else
  {
    Rails.env => {
      'bucket' => ENV['AMAZON_S3_BUCKET'],
      'access_key_id' => ENV['AMAZON_ACCESS_KEY_ID'],
      'secret_access_key' => ENV['AMAZON_SECRET_ACCESS_KEY'] 
    }
  }
end

AWS::S3::Base.establish_connection!(  
  :access_key_id     => S3[Rails.env]["access_key_id"],  
  :secret_access_key => S3[Rails.env]["secret_access_key"]  
)

BUCKET_S3 = S3[Rails.env]["bucket"]
BUCKET_S3_URL = "http://s3.amazonaws.com/#{BUCKET_S3}/"
