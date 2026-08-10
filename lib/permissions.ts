export const menuPermissions: Record<
  string,
  string[]
> = {

  timeslot:[
    "admin",
    "Accès A",
    "Accès C",
  ],

  parents:[
    "admin",
    "Accès A",
    "Accès C",
  ],
  
  announcements: [
    "admin",
    "Directeur",
    "Accès A",
    "Accès C",
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
    "Accès C",
    
  ],

  admission: [
    "admin",
    "Accès A",
    
    "Accès C",
    
  ],

  staff: [
    "admin",
    "Accès A",
    
    "Accès C",
    
    
  ],

  classroom: [
    "admin",
    "Accès A",
    "Censeur",
    
    "Accès C",
  ],

  subjects: [
    "admin",
    "Accès A",
    
    "Accès C",
    
  ],
  assignment: [
    "admin",
    "Accès A",
    
    "Accès C",
    
    
  ],
  schedule: [
    "admin",
    "Accès A",
    "Censeur",
    "Educateur",
    
    "Accès C",
    
  ],

  grade: [
    "admin",
    "Accès A",
    "Censeur",
    
    "Accès C",
    
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
    
  ],

  students: [
    "admin",
    "Accès A",
    "teacher",
    "Educateur",
    "Accès compta",
    "Accès C",
  ],

  teachers: [
    "admin",
    "Accès A",
    
    "Accès C",
    
  ],

  academics: [
    "admin",
    "Accès A",
    "teacher",
   
    "Accès C",
    
  ],

  evaluations: [
    "admin",
    "Accès A",
    "Censeur",
    
    "Accès C",
  ],

  teacherAttendance: [
    "admin",
    "Accès A",
    "Censeur",
    "Educateur",
   
    "Accès C",
    
  ],

  studentAttendance: [
    "admin",
    "Accès A",
    "teacher",
    "Educateur",
    
    "Accès C",
   
  ],
  

  staffAttendance: [
    "admin",
    "Accès A",
    "Educateur",
    
    "Accès C",
    
  ],

  finance: [
    "admin",
    "Accès A",
    "econome",
    "Accès compta",
    "Accès C",
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