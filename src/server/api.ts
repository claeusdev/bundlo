import axios from "axios";
import semver from "semver";
import getSizes from "package-size";

interface DistTag {
  latest: string;
  next: string;
  experimental: string;
  beta: string;
  rc: string;
}

interface Version {
  [key: string]: {
    name: string;
    description: string;
    version: string;
    author: {
      name: string;
      email: string;
    };
    repository: {
      type: string;
      url: string;
    };
    bugs: {
      url: string;
    };
    licenses: {
      type: string;
      url: string;
    }[];
    main: string;
    engines: {
      node: string;
    };
    dependencies: any;
    devDependencies: {};
  };
}
interface MetaData {
  data: {
    _id: string;
    _rev: string;
    name: string;
    description: string;
    distTags: DistTag;
    versions: string[];
  };
}
class Api {
  private url: string = `https://registry.npmjs.com`;

  constructor() {}
  async getData(name: string) {
    try {
      const data = await axios.get(`${this.url}/${name}`);
      const tags = this.getDistTags(data);
      const versions = getAllVersions(data);
      const meta = {
        name: data.data._id,
        description: data.data.description,
        versions: versions.slice(Math.max(versions.length - 3, 0)),
        distTags: tags,
      };
      const versionsWithNames = this.getCorrectVersionNames(
        meta.versions,
        meta.name
      );
      const sizes = await this.getAllSizes(getSizes, versionsWithNames);

      return { meta, sizes };
    } catch (error) {
      return error.message;
    }
  }

  async getAllSizes(cb: (item: string) => void, arr: string[]) {
    try {
      const list = await Promise.all(
        arr.map(async (item) => {
          const l = cb(item);
          return l;
        })
      );
      return list;
    } catch (error) {
      return error.message;
    }
  }

  getCorrectVersionNames(versions: string[], name: string) {
    return versions.map((version) => `${name}@${version}`);
  }

  async getDistTags(metadata: MetaData) {
    const obj = await Promise.resolve(metadata);
    return obj.data["dist-tags"];
  }
}

/**
 * Get all versions of the npm package and order
 * by semver oldest to newest
 */
function getAllVersions(metadata: MetaData) {
  return Object.keys(metadata.data.versions).sort((a, b) => {
    return semver.gt(a, b) ? 1 : semver.eq(a, b) ? 0 : -1;
  });
}

export { Api };
