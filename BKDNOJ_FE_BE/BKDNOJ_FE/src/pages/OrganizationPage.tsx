import { Link } from "react-router-dom";
import { Globe } from "lucide-react";

interface Organization {
  slug: string;
  name: string;
  isOpen: boolean;
  isPublic: boolean;
  memberCount: number;
  hasBrowseAccess: boolean;
}

export const OrganizationPage = () => {
  const organizations: Organization[] = [
    {
      slug: "JAVA2216",
      name: "Lập trình Java 22Nh16",
      isOpen: true,
      isPublic: true,
      memberCount: 0,
      hasBrowseAccess: false
    },
    {
      slug: "JAVA2299",
      name: "Lớp Java 22Nh99",
      isOpen: true,
      isPublic: true,
      memberCount: 0,
      hasBrowseAccess: false
    },
    {
      slug: "TRI",
      name: "Tri",
      isOpen: true,
      isPublic: true,
      memberCount: 4,
      hasBrowseAccess: true
    },
    {
      slug: "OLPBKDNK23",
      name: "Nhóm tham gia đội OLP tin học của BKĐN Khóa 23",
      isOpen: true,
      isPublic: true,
      memberCount: 1,
      hasBrowseAccess: true
    },
    {
      slug: "BKDNOJFREE",
      name: "bkdnojFree",
      isOpen: true,
      isPublic: true,
      memberCount: 7,
      hasBrowseAccess: true
    }
  ];

  return (
    <div className="one-column-wrapper">
      <div className="one-column-element">
        <div className="wrapper-vanilla bg-white shadow rounded" id="org-main">
          <div id="org-title-div" className="grid grid-cols-12 border-b p-3">
            <div className="flex items-center justify-center col-span-12 md:col-span-3">
              <h4 className="pl-2 pr-2 m-0 text-xl font-bold">Organization</h4>
            </div>
            <div className="org-path col-span-12 md:col-span-9 flex items-center overflow-hidden">
              <div className="flex" style={{ width: "100%", overflowX: "auto", boxSizing: "content-box" }}>
                <div className="org-path-item flex items-center">
                  <Globe size={18} className="mr-2" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1">
            <div className="org-table-wrapper-col m-1 col-span-12">
              <div className="org-table">
                <div className="org-table-wrapper m-1 border-b">
                  <div className="table-responsive">
                    <table className="rounded w-full">
                      <tbody className="w-100">
                        {organizations.map((org) => (
                          <tr key={org.slug} className="org-list org-item border-b hover:bg-gray-50">
                            <td className="org-i h-100 p-4 w-[150px] text-center">
                              <span className="org-slug font-medium">{org.slug}</span>
                            </td>
                            <td className="org-name-td p-2">
                              <div className="org-name-wrapper border-b m-2 pb-2">
                                <h6 className="org-name text-lg font-semibold">{org.name}</h6>
                              </div>
                              <div className="org-about-wrapper w-100 flex space-x-3 mb-2">
                                <span className="org-tag px-2 py-1 bg-secondary rounded-md">
                                  <span className="hidden md:flex">Open</span>
                                </span>
                                <span className="org-tag px-2 py-1 bg-secondary rounded-md">
                                  <span className="hidden md:flex">Public</span>
                                </span>
                                <span className="org-tag px-2 py-1 bg-secondary rounded-md">
                                  <span>{org.memberCount}</span>
                                </span>
                              </div>
                              <div className="org-panel text-right">
                                {org.hasBrowseAccess ? (
                                  <>
                                    <Link className="ml-2 mr-2 text-blue-600 hover:underline" to={`/orgs/${org.slug}`}>
                                      Browse
                                    </Link>
                                    <span>|</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-secondary ml-2 mr-2">Browse</span>
                                    <span>|</span>
                                  </>
                                )}
                                <Link className="ml-2 mr-2 text-blue-600 hover:underline" to={`/orgs/${org.slug}`}>
                                  Detail
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <span className="classic-pagination block p-3 flex justify-center">
                  Page:
                  <ul className="inline-flex ml-2">
                    <li className="mx-1"><span className="font-bold">[1]</span></li>
                  </ul>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;
