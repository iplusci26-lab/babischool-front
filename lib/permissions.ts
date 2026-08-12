export const menuPermissions: Record<
  string,
  string[]
> = {

  timeslot:[
    "admin",
    "Accès A",
  ],

  parents:[
    "admin",
    "Accès A", 
  ],
  
  announcements: [
    "admin",
    "Directeur",
    "Accès A",
    "Accès B",
  ],

  dashboard: [
    "admin",
    "Accès A",
  ],

  reinscription: [
    "admin", 
    "Accès A"
  ],

  term: [
    "admin",
    "Accès A",
  ],

  admission: [
    "admin",
    "Accès A",
  ],

  staff: [
    "admin",
    "Accès A",
  ],

  classroom: [
    "admin",
    "Accès A",
    "Censeur",
    "Accès B",
    "Accès C",
  ],

  subjects: [
    "admin",
    "Accès A",
    "Accès B",
    
  ],
  assignment: [
    "admin",
    "Accès A",
    "Accès B",
  ],

  schedule: [
    "admin",
    "Accès A",
    "Censeur",
    "Educateur",
    "Accès B",
    "Accès C",
    
  ],

  grade: [
    "admin",
    "Accès A",
    "Censeur",
    
  ],

  messages: [
    "admin",
    "Accès A",
    "teacher",
    "Econome",
    "Educateur",
    "Censeur",
    "Parent",
    "Accès compta",
    "Accès C",
    "Accès B",
    
  ],

  students: [
    "admin",
    "Accès A",
    "teacher",
    "Educateur",
    "Accès compta",
    "Accès C",
    "Accès B",
  ],

  teachers: [
    "admin",
    "Accès A",
    "Accès B",
    
  ],

  academics: [
    "admin",
    "Accès A",
    "teacher",
    "Accès B",
    
  ],

  evaluations: [
    "admin",
    "Accès A",
    "Censeur",
    "Accès B",
  ],

  teacherAttendance: [
    "admin",
    "Accès A",
    "Censeur",
    "Educateur",
    "Accès B",
    
  ],

  studentAttendance: [
    "admin",
    "Accès A",
    "teacher",
    "Educateur",
    "Accès B",
    "Accès C",
   
  ],
  

  staffAttendance: [
    "admin",
    "Accès A",
    "Educateur",
    "Accès B",
  ],

  finance: [
    "admin",
    "Accès A",
    "econome",
    "Accès compta",
  ],

  settings: [
    "admin",
    "Accès A",
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