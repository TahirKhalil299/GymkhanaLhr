export interface DealBranches {
  Branch_Code: string;        // ✅ Fixed: Changed from BranchCode to Branch_Code
  Branch_Name: string;        // ✅ Fixed: Changed from BranchName to Branch_Name  
  Branch_City: string;        // ✅ Fixed: Changed from BranchCity to Branch_City
  Branch_Latitude: string;    // ✅ Fixed: Changed from _branchLatitude to Branch_Latitude
  Branch_Longitude: string;   // ✅ Fixed: Changed from _branchLongitude to Branch_Longitude
  phoneNumber?: string;       // ✅ Made optional since it's not in your API response
}

export interface GetBranchesNameResponse {
  StatusCode: string;
  StatusDesc: string;
  data: {
    DealBranches: DealBranches[];
  };
}