import axios from "axios";
import semver from "semver";
import getSizes from "package-size";

const url = `https://registry.npmjs.com`;

async function getData(name) {
  try {
    const data = await axios.get(`${url}/${name}`);
    const tags = getDistTags(data);
    const versions = getAllVersions(data);
    const meta = {
      name: data.data._id,
      description: data.data.description,
      versions: versions.slice(Math.max(versions.length - 3, 0)),
      distTags: tags
    };

    const versionsWithNames = getCorrectVersionNames(meta.versions, meta.name);
    const sizes = await getAllSizes(getSizes, versionsWithNames);

    return { meta, sizes };
  } catch (error) {
    return error.message;
  }
}

async function getAllSizes(cb, arr) {
  try {
    const list = await Promise.all(
      arr.map(async item => {
        const l = await cb(item);
        return l;
      })
    );
    return list;
  } catch (error) {
    return error.message;
  }
}

function getCorrectVersionNames(versions, name) {
  return versions.map(version => `${name}@${version}`);
}

async function getDistTags(metadata) {
  const obj = await Promise.resolve(metadata);
  return obj.data["dist-tags"];
}

/**
 * Get all versions of the npm package and order
 * by semver oldest to newest
 */
function getAllVersions(metadata) {
  return Object.keys(metadata.data.versions).sort((a, b) => {
    return semver.gt(a, b) ? 1 : semver.eq(a, b) ? 0 : -1;
  });
}

module.exports = {
  getData
};
