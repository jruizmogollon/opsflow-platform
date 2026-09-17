enum TicketStatus { open, inProgress, resolved, closed }

enum TicketPriority { low, medium, high, critical }

class Ticket {
  const Ticket({
    required this.id,
    required this.title,
    required this.description,
    required this.priority,
    required this.status,
    this.assignee,
  });

  final String id;
  final String title;
  final String description;
  final TicketPriority priority;
  final TicketStatus status;
  final String? assignee;

  factory Ticket.fromJson(Map<String, dynamic> json) => Ticket(
        id: json['id'] as String,
        title: json['title'] as String,
        description: json['description'] as String,
        priority: _priority(json['priority'] as String),
        status: _status(json['status'] as String),
        assignee: json['assignee'] as String?,
      );

  static TicketPriority _priority(String value) => TicketPriority.values.firstWhere(
        (item) => item.name.toLowerCase() == value.toLowerCase(),
        orElse: () => TicketPriority.medium,
      );

  static TicketStatus _status(String value) => TicketStatus.values.firstWhere(
        (item) => item.name.toLowerCase() == value.toLowerCase(),
        orElse: () => TicketStatus.open,
      );
}
