import Mock from 'mockjs';

// 模拟数据
const mockData = {
  meetings: [],
  nextId: 1,
  statusMap: {
    0: '未发起',
    1: '待召开',
    2: '进行中',
    3: '已完成',
    4: '已取消'
  }
};

// 初始化模拟数据
const initMockData = () => {
  const teams = ['生产一班', '生产二班', '设备维护班', '质量检测班', '安全监察班'];
  const hosts = ['张三', '李四', '王五', '赵六', '钱七'];
  const regions = ['一楼会议室', '二楼培训室', '生产车间办公室', '安全监控中心', '设备维修间'];
  const tasks = [
    '今日生产任务安排',
    '设备安全检查',
    '质量指标分析',
    '安全生产培训',
    '应急预案演练',
    '交班事项说明',
    '新员工指导',
    '月度工作总结'
  ];
  
  for (let i = 0; i < 50; i++) {
    const teamIndex = i % teams.length;
    const hostIndex = i % hosts.length;
    const regionIndex = i % regions.length;
    const taskIndex = i % tasks.length;
    const status = i % 5; // 均匀分布5种状态
    
    // 生成会议时间（未来7天或过去7天）
    const baseDate = new Date();
    const timeOffset = Mock.Random.integer(-7, 7);
    baseDate.setDate(baseDate.getDate() + timeOffset);
    baseDate.setHours(8 + i % 8, 0, 0, 0);
    
    // 生成参会人员
    const totalParticipants = Mock.Random.integer(5, 20);
    const actualParticipants = status >= 2 ? Mock.Random.integer(totalParticipants - 3, totalParticipants) : 0;
    
    const meeting = {
      id: mockData.nextId++,
      meeting_name: `班前会-${teams[teamIndex]}-${Mock.Random.date('MM-dd')}`,
      team_id: (teamIndex + 1).toString(),
      team_name: teams[teamIndex],
      meeting_time: baseDate.toISOString(),
      region_id: (regionIndex + 1).toString(),
      region_name: regions[regionIndex],
      host_id: (hostIndex + 1).toString(),
      host_name: hosts[hostIndex],
      attendance: {
        total: totalParticipants,
        actual: actualParticipants
      },
      status: status.toString(),
      task_content: tasks[taskIndex],
      participants: Array.from({ length: totalParticipants }, (_, idx) => ({
        id: idx + 1,
        name: `员工${idx + 1}`,
        department: ['生产部', '设备部', '质量部', '安全部'][idx % 4]
      })),
      attachments: [
        {
          id: 1,
          name: '安全规范.pdf',
          url: '/attachments/safety.pdf',
          size: '2.5MB'
        },
        {
          id: 2,
          name: '生产计划.xlsx',
          url: '/attachments/plan.xlsx',
          size: '1.8MB'
        }
      ],
      created_time: new Date(Date.now() - i * 86400000).toISOString(),
      created_by: 'admin',
      remarks: status === 4 ? '因设备故障临时取消' : ''
    };
    
    // 添加会议纪要（仅已完成会议）
    if (status === 3) {
      meeting.minutes = {
        content: `本次班前会主要讨论了${tasks[taskIndex]}，参会人员积极发言，达成以下共识：\n1. 明确今日生产目标\n2. 检查设备安全状态\n3. 分配各岗位任务\n4. 强调安全注意事项`,
        recorder: '李四',
        record_time: new Date(baseDate.getTime() + 3600000).toISOString(),
        attachments: [
          {
            id: 3,
            name: '会议记录.docx',
            url: '/attachments/minutes.docx',
            size: '1.2MB'
          }
        ]
      };
    }
    
    mockData.meetings.push(meeting);
  }
  
  console.log('初始化会议模拟数据完成，共生成', mockData.meetings.length, '条数据');
};

// 初始化数据
initMockData();

/**
 * 获取会议列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
const getMeetingList = (params = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const {
        page = 1,
        page_size = 10,
        meeting_name,
        team_id,
        region_id,
        status,
        host_id,
        start_time,
        end_time,
        ...rest
      } = params;
      
      // 过滤数据
      let filteredData = [...mockData.meetings];
      
      if (meeting_name) {
        filteredData = filteredData.filter(item => 
          item.meeting_name.includes(meeting_name)
        );
      }
      
      if (team_id) {
        filteredData = filteredData.filter(item => 
          item.team_id === team_id
        );
      }
      
      if (region_id) {
        filteredData = filteredData.filter(item => 
          item.region_id === region_id
        );
      }
      
      if (status) {
        filteredData = filteredData.filter(item => 
          item.status === status
        );
      }
      
      if (host_id) {
        filteredData = filteredData.filter(item => 
          item.host_id === host_id
        );
      }
      
      if (start_time) {
        filteredData = filteredData.filter(item => 
          new Date(item.meeting_time) >= new Date(start_time)
        );
      }
      
      if (end_time) {
        filteredData = filteredData.filter(item => 
          new Date(item.meeting_time) <= new Date(end_time)
        );
      }
      
      // 排序（按会议时间倒序）
      filteredData.sort((a, b) => 
        new Date(b.meeting_time) - new Date(a.meeting_time)
      );
      
      // 分页
      const total = filteredData.length;
      const start = (page - 1) * page_size;
      const end = start + page_size;
      const list = filteredData.slice(start, end);
      
      // 简化返回数据（去掉详细内容，列表页不需要）
      const simplifiedList = list.map(item => ({
        id: item.id,
        meeting_name: item.meeting_name,
        team_name: item.team_name,
        meeting_time: item.meeting_time,
        region_name: item.region_name,
        host_name: item.host_name,
        attendance: item.attendance,
        status: item.status,
        task_content: item.task_content,
        attachments: item.attachments
      }));
      
      setTimeout(() => {
        resolve({
          code: 200,
          message: 'success',
          data: {
            list: simplifiedList,
            pagination: {
              total,
              page: parseInt(page),
              page_size: parseInt(page_size),
              total_pages: Math.ceil(total / page_size)
            }
          }
        });
      }, Mock.Random.integer(300, 800)); // 模拟网络延迟
      
    } catch (error) {
      reject({
        code: 500,
        message: error.message,
        data: null
      });
    }
  });
};

/**
 * 发起会议
 * @param {string} meetingId 会议ID
 * @returns {Promise}
 */
const startMeeting = (meetingId) => {
  return new Promise((resolve, reject) => {
    try {
      const meeting = mockData.meetings.find(item => item.id.toString() === meetingId.toString());
      
      if (!meeting) {
        reject({
          code: 404,
          message: '会议不存在',
          data: null
        });
        return;
      }
      
      if (meeting.status !== '0') {
        reject({
          code: 400,
          message: `会议状态为"${mockData.statusMap[meeting.status]}"，无法发起`,
          data: null
        });
        return;
      }
      
      // 更新状态为"待召开"
      meeting.status = '1';
      
      // 更新会议时间（如果当前时间晚于原定时间，则设为当前时间）
      const now = new Date();
      const scheduledTime = new Date(meeting.meeting_time);
      if (now > scheduledTime) {
        meeting.meeting_time = now.toISOString();
      }
      
      setTimeout(() => {
        resolve({
          code: 200,
          message: '会议发起成功',
          data: {
            id: meeting.id,
            meeting_name: meeting.meeting_name,
            status: meeting.status,
            status_text: mockData.statusMap[meeting.status],
            meeting_time: meeting.meeting_time
          }
        });
      }, Mock.Random.integer(300, 600));
      
    } catch (error) {
      reject({
        code: 500,
        message: error.message,
        data: null
      });
    }
  });
};

/**
 * 取消会议
 * @param {string} meetingId 会议ID
 * @param {Object} data 取消原因等数据
 * @returns {Promise}
 */
const cancelMeeting = (meetingId, data = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const { reason = '' } = data;
      const meeting = mockData.meetings.find(item => item.id.toString() === meetingId.toString());
      
      if (!meeting) {
        reject({
          code: 404,
          message: '会议不存在',
          data: null
        });
        return;
      }
      
      if (meeting.status === '3' || meeting.status === '4') {
        reject({
          code: 400,
          message: `会议状态为"${mockData.statusMap[meeting.status]}"，无法取消`,
          data: null
        });
        return;
      }
      
      // 更新状态为"已取消"
      meeting.status = '4';
      meeting.remarks = reason;
      
      setTimeout(() => {
        resolve({
          code: 200,
          message: '会议取消成功',
          data: {
            id: meeting.id,
            meeting_name: meeting.meeting_name,
            status: meeting.status,
            status_text: mockData.statusMap[meeting.status],
            remarks: meeting.remarks
          }
        });
      }, Mock.Random.integer(300, 600));
      
    } catch (error) {
      reject({
        code: 500,
        message: error.message,
        data: null
      });
    }
  });
};

/**
 * 获取会议详情
 * @param {string} meetingId 会议ID
 * @returns {Promise}
 */
const getMeetingDetail = (meetingId) => {
  return new Promise((resolve, reject) => {
    try {
      const meeting = mockData.meetings.find(item => item.id.toString() === meetingId.toString());
      
      if (!meeting) {
        reject({
          code: 404,
          message: '会议不存在',
          data: null
        });
        return;
      }
      
      setTimeout(() => {
        resolve({
          code: 200,
          message: 'success',
          data: {
            ...meeting,
            status_text: mockData.statusMap[meeting.status]
          }
        });
      }, Mock.Random.integer(200, 500));
      
    } catch (error) {
      reject({
        code: 500,
        message: error.message,
        data: null
      });
    }
  });
};

/**
 * 保存会议（创建/更新）
 * @param {Object} formData 会议数据
 * @returns {Promise}
 */
const saveMeeting = (formData) => {
  return new Promise((resolve, reject) => {
    try {
      const {
        id,
        meeting_name,
        team_id,
        team_name,
        meeting_time,
        region_id,
        region_name,
        host_id,
        host_name,
        participants,
        task_content,
        attachments = []
      } = formData;
      
      // 验证必填字段
      if (!meeting_name || !team_id || !meeting_time || !region_id || !host_id) {
        reject({
          code: 400,
          message: '请填写完整信息',
          data: null
        });
        return;
      }
      
      if (id) {
        // 更新会议
        const index = mockData.meetings.findIndex(item => item.id.toString() === id.toString());
        
        if (index === -1) {
          reject({
            code: 404,
            message: '会议不存在',
            data: null
          });
          return;
        }
        
        // 更新会议数据
        mockData.meetings[index] = {
          ...mockData.meetings[index],
          meeting_name,
          team_id,
          team_name,
          meeting_time,
          region_id,
          region_name,
          host_id,
          host_name,
          participants,
          task_content,
          attachments,
          updated_time: new Date().toISOString(),
          updated_by: 'admin'
        };
        
        setTimeout(() => {
          resolve({
            code: 200,
            message: '会议更新成功',
            data: {
              id: mockData.meetings[index].id,
              meeting_name: mockData.meetings[index].meeting_name,
              status: mockData.meetings[index].status
            }
          });
        }, Mock.Random.integer(300, 600));
        
      } else {
        // 创建新会议
        const newMeeting = {
          id: mockData.nextId++,
          meeting_name,
          team_id,
          team_name: team_name || `班组${team_id}`,
          meeting_time,
          region_id,
          region_name: region_name || `区域${region_id}`,
          host_id,
          host_name: host_name || `主持人${host_id}`,
          attendance: {
            total: participants?.length || 0,
            actual: 0
          },
          status: '0', // 默认未发起
          task_content,
          participants: participants || [],
          attachments,
          created_time: new Date().toISOString(),
          created_by: 'admin',
          remarks: ''
        };
        
        mockData.meetings.unshift(newMeeting);
        
        setTimeout(() => {
          resolve({
            code: 200,
            message: '会议创建成功',
            data: {
              id: newMeeting.id,
              meeting_name: newMeeting.meeting_name,
              status: newMeeting.status
            }
          });
        }, Mock.Random.integer(300, 600));
      }
      
    } catch (error) {
      reject({
        code: 500,
        message: error.message,
        data: null
      });
    }
  });
};

/**
 * 获取会议统计信息（可选扩展）
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
const getMeetingStatistics = (params = {}) => {
  return new Promise((resolve) => {
    const { team_id, start_time, end_time } = params;
    
    let filteredData = [...mockData.meetings];
    
    if (team_id) {
      filteredData = filteredData.filter(item => item.team_id === team_id);
    }
    
    if (start_time) {
      filteredData = filteredData.filter(item => 
        new Date(item.meeting_time) >= new Date(start_time)
      );
    }
    
    if (end_time) {
      filteredData = filteredData.filter(item => 
        new Date(item.meeting_time) <= new Date(end_time)
      );
    }
    
    // 统计各种状态的会议数量
    const statusStats = {};
    mockData.statusMap.forEach((text, code) => {
      statusStats[code] = {
        count: filteredData.filter(item => item.status === code).length,
        text
      };
    });
    
    // 统计出勤率
    const attendanceStats = filteredData.reduce((acc, meeting) => {
      if (meeting.attendance.total > 0) {
        acc.totalMeetings++;
        acc.totalParticipants += meeting.attendance.total;
        acc.totalAttended += meeting.attendance.actual || 0;
      }
      return acc;
    }, { totalMeetings: 0, totalParticipants: 0, totalAttended: 0 });
    
    const attendanceRate = attendanceStats.totalParticipants > 0 
      ? ((attendanceStats.totalAttended / attendanceStats.totalParticipants) * 100).toFixed(1)
      : 0;
    
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: {
          total_meetings: filteredData.length,
          status_stats: statusStats,
          attendance_stats: {
            ...attendanceStats,
            rate: attendanceRate + '%'
          },
          recent_meetings: filteredData
            .sort((a, b) => new Date(b.meeting_time) - new Date(a.meeting_time))
            .slice(0, 5)
            .map(item => ({
              id: item.id,
              name: item.meeting_name,
              time: item.meeting_time,
              status: item.status
            }))
        }
      });
    }, Mock.Random.integer(300, 600));
  });
};

// 导出所有API函数
export {
  getMeetingList,
  startMeeting,
  cancelMeeting,
  getMeetingDetail,
  saveMeeting,
  getMeetingStatistics
};