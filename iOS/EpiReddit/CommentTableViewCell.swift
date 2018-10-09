//
//  CommentTableViewCell.swift
//  EpiReddit
//
//  Created by Rémi Faucheux on 04/07/2018.
//  Copyright © 2018 Novus. All rights reserved.
//

import UIKit

class CommentTableViewCell: UITableViewCell {

    @IBOutlet weak var authorLabel: UILabel!
    @IBOutlet weak var infoLabel: UILabel!
    @IBOutlet weak var contentLabel: UITextView!
    @IBOutlet weak var upVoteButton: UIButton!
    @IBOutlet weak var downVoteButton: UIButton!
    @IBOutlet weak var upvoteLabel: UILabel!
    
    @IBAction func onUpvote(_ sender: Any) {
        if onUpvote != nil {
            onUpvote!()
        }
    }
    
    @IBAction func onDownvote(_ sender: Any) {
        if onDownvote != nil {
            onDownvote!()
        }
    }
    
    var onUpvote: (() -> Void)? = nil
    var onDownvote: (() -> Void)? = nil
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
