# Make sure remotes are up to date (with stale remotes purged):
git fetch -p
 
# Initial no-op run --- do the branches to delete look correct?
# Be careful to omit 'master' from the output.
git branch --remote --merged origin/develop | grep -v 'develop' | cut -b 10- | xargs
 
# Do the bulk delete!!!  (can take a long time...)
git branch --remote --merged origin/develop | grep -v 'develop' | cut -b 10- | xargs git push --delete origin
