import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-select-timeslot',
  templateUrl: './select-timeslot.page.html',
  styleUrls: ['./select-timeslot.page.scss'],
})
export class SelectTimeslotPage implements OnInit {
  date: any;
  type: 'string';
  choose_scheduleID: any;
  choose_date: any;
  choose_time: any;
  no_slots_today: boolean = false;
  data: any;
  location_id: any;
  location_name: any;
  helpline_number: any;
  doctor_id: any;
  last_selected_time: any;
  last_parentIndex: any;
  last_slot_index: any;
  time_range: any = [{
    title: "Morning 6 AM to 12 Noon",
    showslots: false,
    time_slots: []
  },
  {
    title: "Afternoon 12 PM to 4 PM",
    showslots: false,
    time_slots: []
  },
  {
    title: "Evening 4 PM to 8 PM",
    showslots: false,
    time_slots: []
  },
  {
    title: "Night 8 PM to 10 PM",
    showslots: false,
    time_slots: []
  }]
  time_slots: any = [];
  timeSlots: any = [];
  book_type;
  speciality_id;
  speciality_name;
  constructor(private statusBar: StatusBar, private route: ActivatedRoute, private location: Location, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.statusBar.backgroundColorByHexString('#ffffff');
    this.route.queryParams.subscribe((params) => {
      this.location_name = this.router.getCurrentNavigation().extras.state.location_name;
      this.data = this.router.getCurrentNavigation().extras.state.data;
      this.helpline_number = this.router.getCurrentNavigation().extras.state.helpline_number;
      this.location_id = this.data.location_id;
      this.doctor_id = this.data.doctor_id;
      this.speciality_id = this.router.getCurrentNavigation().extras.state.speciality_id;
      this.speciality_name = this.router.getCurrentNavigation().extras.state.speciality_name;
      this.book_type = this.router.getCurrentNavigation().extras.state.book_type;
      this.getTimeSlots();
    });
  }

  ngOnInit() {
  }

  goBack() {
    // this.location.back();
    let navigationExtras: NavigationExtras = {
      state: {
        location_id: this.location_id,
        location_name: this.location_name,
        helpline_number: this.helpline_number,
        speciality_id: this.speciality_id,
        speciality_name: this.speciality_name,
        book_type: this.book_type
      },
    };
    this.router.navigate(['/book-appointment'], navigationExtras);
  }

  onChange(val) {
    let date = val._d;
    //console.log(date)
    this.choose_date = date;
    var day = date.getDay();
    console.log(day)
    if (day == 1) {
      var t = this.timeSlots.filter(x => x.days == 'Monday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }
    if (day == 2) {
      var t = this.timeSlots.filter(x => x.days == 'Tuesday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }
    if (day == 3) {
      var t = this.timeSlots.filter(x => x.days == 'Wednesday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }
    if (day == 4) {
      var t = this.timeSlots.filter(x => x.days == 'Thursday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }
    if (day == 5) {
      var t = this.timeSlots.filter(x => x.days == 'Friday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }
    if (day == 6) {
      var t = this.timeSlots.filter(x => x.days == 'Saturday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }
    if (day == 0) {
      var t = this.timeSlots.filter(x => x.days == 'Sunday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }

  }

  chooseTimeslot(parentindex, childindex, time) {
    // debugger
    console.log("parentindex", parentindex)
    console.log("childindex", childindex)
    console.log("this.last_parentIndex", this.last_parentIndex)
    console.log("this.last_selected_time", this.last_selected_time)
    if (this.last_selected_time == undefined) {
      this.choose_scheduleID = time.id;
      this.choose_time = time.time_slots;
      this.time_range[parentindex].time_slots[childindex]['is_time_selected'] = true;
      this.last_selected_time = childindex;
      this.last_parentIndex = parentindex;
    } else {
      this.choose_scheduleID = time.id;
      this.choose_time = time.time_slots;
      if (this.last_parentIndex == parentindex && this.last_selected_time == childindex) {

      } else {
        this.time_range[parentindex].time_slots[childindex]['is_time_selected'] = true;
      }
      if (this.last_parentIndex != parentindex && this.last_selected_time != childindex) {
        // this.time_range[this.last_parentIndex].time_slots[this.last_selected_time]['is_time_selected'] = false;
        if (this.time_range[this.last_parentIndex].time_slots[this.last_selected_time]['is_time_selected']) {
          this.time_range[this.last_parentIndex].time_slots[this.last_selected_time]['is_time_selected'] = false;
        } else {
          this.time_range[this.last_parentIndex].time_slots[this.last_selected_time]['is_time_selected'] = true;
        }
      } else {
        if (this.time_range[this.last_parentIndex].time_slots[this.last_selected_time]['is_time_selected']) {
          this.time_range[this.last_parentIndex].time_slots[this.last_selected_time]['is_time_selected'] = false;
        } else {
          this.time_range[this.last_parentIndex].time_slots[this.last_selected_time]['is_time_selected'] = true;
        }
      }
      this.last_selected_time = childindex;
      this.last_parentIndex = parentindex;
    }
  }


  expandItem(val, index) {
    //debugger
    if (this.last_slot_index == undefined) {
      this.time_range[index].showslots = true;
      this.last_slot_index = index;
    } else {
      if (index == this.last_slot_index) {
        if (this.time_range[index].showslots) {
          this.time_range[this.last_slot_index].showslots = false;
        } else {
          this.time_range[this.last_slot_index].showslots = true;
        }
      } else {
        this.time_range[index].showslots = true;
        this.time_range[this.last_slot_index].showslots = false;
      }
      this.last_slot_index = index;
    }
  }


  todayTimeslot(date) {

    var day = date.getDay();
    this.choose_date = date;
    this.date = date;

    if (day == 1) {
      var t = this.timeSlots.filter(x => x.days == 'Monday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }
    if (day == 2) {
      var t = this.timeSlots.filter(x => x.days == 'Tuesday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }
    if (day == 3) {
      var t = this.timeSlots.filter(x => x.days == 'Wednesday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }
    if (day == 4) {
      var t = this.timeSlots.filter(x => x.days == 'Thursday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }
    if (day == 5) {
      var t = this.timeSlots.filter(x => x.days == 'Friday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }
    if (day == 6) {
      var t = this.timeSlots.filter(x => x.days == 'Saturday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }
    if (day == 7) {
      var t = this.timeSlots.filter(x => x.days == 'Sunday');
      t.map(y => {
        y.time_value = (y.time_slots.split(' ')[0]).split(':')[0];
        y.am_pm = (y.time_slots.split(' ')[1]);
      });
      this.time_slots = t;
      this.time_range.map(z => {
        if (z.title == 'Morning 6 AM to 12 Noon') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'am' && (m.time_value == 6 || m.time_value < 12)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Afternoon 12 PM to 4 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (m.time_value == 12 || m.time_value < 4)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Evening 4 PM to 8 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (4 < m.time_value == m.time_value < 8)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        } else if (z.title == 'Night 8 PM to 10 PM') {
          z.time_slots = [];
          this.time_slots.filter(m => {
            if (m.am_pm == 'pm' && (8 < m.time_value == m.time_value < 10)) {
              m.is_time_selected = false;
              z.time_slots.push(m);
            }
          })
        }
      })
    }

  }

  getTimeSlots() {
    this.utility.showLoading();
    this.http.getDoctorTimeslot('getSchedules/location/' + this.location_id + '/doctor/' + this.doctor_id, {}).subscribe(
      (res: any) => {
        console.log(res)
        if (res.success) {
          this.utility.hideLoading();
          this.timeSlots = res.data;
          if (this.timeSlots.length == 0) {
            this.no_slots_today = true;
          } else {
            this.todayTimeslot(new Date());
          }
        }else{
          this.utility.hideLoading();
          this.utility.showMessageAlert("No schedules!", res.message)
        }
      }, err => {
        this.utility.showMessageAlert("Network error!", "Please check your network connection.")
      })
  }

  bookViaApp() {
    console.log(this.choose_date)
    if (this.choose_time == undefined) {
      this.utility.showMessageAlert("Time slot required!", 'Please choose time slot of your appointment')
    } else {
      let navigationExtras: NavigationExtras = {
        state: {
          location_name: this.location_name,
          data: this.data,
          location_id: this.location_id,
          doctor_id: this.doctor_id,
          schedule_id: this.choose_scheduleID,
          date: this.choose_date,
          time: this.choose_time,
          book_type: this.book_type,
          speciality_name: this.speciality_name
        },
      };
      console.log(navigationExtras)

      this.router.navigate(['/confirm-appointment'], navigationExtras);
    }

  }
}
