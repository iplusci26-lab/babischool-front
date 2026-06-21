export const menuPermissions: Record<
  string,
  string[]
> = {

  
  announcements: [
    "admin",
    "Directeur",
  ],

  dashboard: [
    "admin",
    "Directeur",
  ],

  reinscription: [
    "admin", 
    "Directeur"
  ],
  term: [
    "admin",
    "Directeur",
    
  ],

  admission: [
    "admin",
    "Directeur",
    
  ],

  staff: [
    "admin",
    "Directeur",
    
    
  ],

  classroom: [
    "admin",
    "Directeur",
    "Censeur",
  ],

  subjects: [
    "admin",
    "Directeur",
    
  ],
  assignment: [
    "admin",
    "Directeur",
    
    
  ],
  schedule: [
    "admin",
    "Directeur",
    "Censeur",
    "Educateur"
    
  ],

  grade: [
    "admin",
    "Directeur",
    "Censeur",
    
  ],

  messages: [
    "admin",
    "Directeur",
    "teacher",
    "Econome",
    "Educateur",
    "Censeur",
    "Parent"
    
  ],

  students: [
    "admin",
    "Directeur",
    "teacher",
    "Educateur"
  ],

  teachers: [
    "admin",
    "Directeur",
    
  ],

  academics: [
    "admin",
    "Directeur",
    "teacher",
    
  ],

  evaluations: [
    "admin",
    "Directeur",
    "Censeur",
  ],

  teacherAttendance: [
    "admin",
    "Directeur",
    "Censeur",
    "Educateur"
    
  ],

  studentAttendance: [
    "admin",
    "Directeur",
    "teacher",
    "Educateur"
   
  ],
  

  staffAttendance: [
    "admin",
    "Directeur",
    "Educateur"
    
  ],

  finance: [
    "admin",
    "Directeur",
    "econome",
  ],

  settings: [
    "admin",
    "Directeur",
  ],
};

export function canAccess(menu: string, user: any) {

  if (!user) return false;

  // superuser bypass
  if (user.is_superuser) {
    return true;
  }

  /*if(user.user_type=="Parent"){

    return true
  }*/

  const allowed =
    menuPermissions[menu];

  if (!allowed) {
    return false;
  }

  return allowed.includes(
    user?.role?.name
  );
}