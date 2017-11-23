threads_count = ENV.fetch('MAX_THREADS') { 5 }.to_i
threads threads_count, threads_count

if ENV['SOCKET'] then
  bind 'unix://' + ENV['SOCKET']
else
  port ENV.fetch('PORT') { 3000 }
end

environment ENV.fetch('RAILS_ENV') { 'development' }
workers     ENV.fetch('WEB_CONCURRENCY') { 2 }

preload_app!

on_worker_boot do
  ActiveRecord::Base.establish_connection if defined?(ActiveRecord)
end

plugin :tmp_restart

before_fork do
  require 'puma_worker_killer'

  rolling_restart_interval = (ENV['PUMA_WORKER_RESTART_INTERVAL'] || (6 * 3600)).to_i
  PumaWorkerKiller.enable_rolling_restart(rolling_restart_interval)
end
