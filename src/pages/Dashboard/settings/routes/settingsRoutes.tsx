// must export array

import { Settings } from "../components/settings";

const SettingsRoutes = [
 
   {
      path: "settings",
      children: [
        {
          index: true,
          element: <Settings />,
        },
        // {
        //   path: "addNotes",
        //   element: <AddNotes />,
        // },
      ],
    },
  
];

export default SettingsRoutes;
