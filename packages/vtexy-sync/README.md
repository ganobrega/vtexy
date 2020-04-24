## VTEXY-SYNC

## Scope

1. **How we will know if local data is right with remote?**

   > We need to save a representation of version in somewhere. I think in a .XML file > on CMS. Like a COMMIT in GIT.

2. How will happen the pull command?

   > When call 'pull' command, the version in remote XML will be compared with the > local version in a .vtexy file.
   > If the versions are different, then all data will be downloaded to local and a . process like MERGE of Git will happen for conflicts.

3. How we will download all data?

   > We need to track and map all endpoints in CMS and do a "Crawler" like. Because CMS is to old, the endpoints response are HTML type.

4. How will happen the push command?

   > Like 'pull', we will map the VTEX CMS API to send the local to him. Is like GIT.

5. And the authentication?
   > We will use the Login API of https://www.npmjs.com/package/vtex. Because we need to authenticate the user and we dont want to use Puppeteer.

## Helpers

- Concurrent Version System:
  - Aegis(http://aegis.sourceforge.net/)
  - CVS (https://www.nongnu.org/cvs/)

## TODO

- [ ] Login Function
- [ ] Integrity Function
- [ ] Map endpoints to pull
- [ ] Find a solution to compare production data with local data
- [ ] Map endpoints to push
